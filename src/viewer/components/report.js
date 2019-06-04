import React from 'react';
import {findDOMNode} from 'react-dom';
import PropTypes from 'prop-types';
import './report.css';
import Band from './band';
import { Common } from './common';

export default class Report extends React.Component {
    constructor(props){
        super(props);
        this.state=this.calcState(props);
        //console.log('jrjson',props.design)
    }
    calcState=({design,data,param})=>{
        Common.RATIO=824/Number(design._attributes.columnWidth);
        Common.YRATIO=1170/Number(design._attributes.pageHeight);

        Common.complete=0;
        Common.param=param||{};
        Common.design=design;
        Common.dataset=data;
        Common.data=Common.compileData(design,data);
        let pages=[Common.processSubDataSet(design)];
        return {
            design,
            pages,
            lastPageDetailBandHeight:'auto',
            lastPageOnlySummary:false
        };
    }
    componentWillReceiveProps(props){
        this.setState(this.calcState(props));
    }
    componentDidMount(){
        if(Common.isDone(this.state.pages) && !Common.complete){
            Common.complete=1;
            this.setState({});
        }
    }
    onAdjust=(page)=>(data)=>{
        let {pages}=this.state;
        if(!data){
            if(Common.isDone(pages) && !Common.complete){
                Common.complete=1;
            }
            return;
        }
        //console.log('adjusting page',page,data)
        pages[page][data.subDatasetName].end=data.end;
        let diff=Common.dataset[data.subDatasetName].length-data.end
        if(diff>0)
            pages.push(Common.createSubDataSetFromPrevious(pages[page],data.subDatasetName));
        Common.data.V.PAGE_COUNT=pages.length;
        this.setState({pages});
        if(Common.isDone(pages) && !Common.complete){
            Common.complete=1;
        }
    }
    componentDidUpdate(){
        if(Common.complete===1){
            Common.complete=2;//completed already
            if(this.state.design.summary){//need to adjust summary
                let lastPageDetailBand=findDOMNode(this.refs.lastPageDetailBand);
                let summaryBand=findDOMNode(this.refs.summaryBand);
                let totalDetailBandHeight=0;
                for(let i=0;i<lastPageDetailBand.children.length;i++) totalDetailBandHeight+=lastPageDetailBand.children[i].clientHeight
                let maxHeight=Number(lastPageDetailBand.style.maxHeight.replace("px",""));
                if(summaryBand.clientHeight+totalDetailBandHeight>maxHeight){
                    let {pages}=this.state;
                    pages.push("summary");
                    this.setState({ pages,lastPageOnlySummary:true });
                }else{
                    this.setState({lastPageDetailBandHeight:totalDetailBandHeight});
                }
            }
            this.props.onDone && this.props.onDone(this.state.pages.length);
        }
    }
    render(){
        let {design,pages,lastPageOnlySummary}=this.state;
        let hasLastPageFooter=false;
        if(design.lastPageFooter!==undefined){
            if(design.lastPageFooter.band._attributes.height!=="0")
                hasLastPageFooter=true;
        }
        let pageAttr={className:"page",style:{...Common.Attr2Style(design),width:'824px'}};
        let maxWidth=(824-Number(pageAttr.style.paddingRight.replace("px",""))-Number(pageAttr.style.paddingLeft.replace("px","")))+"px";
        return <div className="page-container">
            {
                pages.map((m,i)=>{
                    let variable={
                        PAGE_NUMBER:(i+1),
                        PAGE_COUNT:pages.length
                    };
                    let backgroundBand=design.background?<Band name="background" design={design.background.band} style={{position:'absolute',height:pageAttr.style.height}} variable={variable} />:null
                    if(m==="summary")
                        return <div key={i} {...pageAttr}>
                            { backgroundBand }
                            <Band ref="summaryBand" name="summary" design={design.summary.band} dataset={m} variable={variable} style={{maxWidth}} />
                        </div>
                    let isFirst=i===0;
                    let lastPageIndex=pages.length-1;
                    let isLast=i===lastPageIndex;
                    if(!isLast && pages[lastPageIndex]==="summary" && i===lastPageIndex-1){
                        isLast=true;
                    }
                    let lastBandName='pageFooter';
                    if(isLast && hasLastPageFooter)
                        lastBandName='lastPageFooter';
                    let columnFooterBottom=0;
                    let availableHeight=Common.val(design._attributes.pageHeight,true);
                    if(isFirst && design.title) availableHeight-=Common.val(design.title.band._attributes.height,true);
                    if(design.pageHeader) availableHeight-=Common.val(design.pageHeader.band._attributes.height,true);
                    if(design.columnHeader) availableHeight-=Common.val(design.columnHeader.band._attributes.height,true);
                    if(design.columnFooter) availableHeight-=Common.val(design.columnFooter.band._attributes.height,true);
                    if(design[lastBandName]){
                        columnFooterBottom=Common.val(design[lastBandName].band._attributes.height,true);
                        availableHeight-=columnFooterBottom;
                    }
                    let bottomToAdd=Common.val(design._attributes.bottomMargin,true);
                    return <div key={i} {...pageAttr}>
                        { backgroundBand }
                        {
                            isFirst && design.title ? <Band name="title" design={design.title.band} variable={variable} style={{maxWidth}} />:null
                        }
                        {
                            ["pageHeader","columnHeader"].filter(f=>design[f])
                            .map((n,j)=><Band key={j} name={n}
                                design={design[n].band} dataset={m} variable={variable} onAdjust={this.onAdjust(i)}
                                style={{maxWidth}} />)
                        }
                        {
                            design.detail?<Band {...(isLast?{ ref:"lastPageDetailBand"}:{})} name="detail" design={design.detail.band} dataset={m} variable={variable} onAdjust={this.onAdjust(i)} style={{height:(isLast?this.state.lastPageDetailBandHeight:'auto'),maxHeight:availableHeight+"px",maxWidth}} />:null
                        }
                        {
                            isLast && design.summary && !lastPageOnlySummary?<Band ref="summaryBand" name="summary" design={design.summary.band} dataset={m} variable={variable} style={{maxWidth}} />:null
                        }
                        {
                            design.columnFooter?<Band name="columnFooter" design={design.columnFooter.band} dataset={m} variable={variable} style={{position:'absolute',width:'100%',bottom:(bottomToAdd+columnFooterBottom)+'px',maxWidth}} />:null
                        }
                        {
                            design[lastBandName]?<Band name={lastBandName} design={design[lastBandName].band} variable={variable} style={{position:'absolute',width:'100%',bottom: bottomToAdd+'px',maxWidth}}  />:null
                        }
                    </div>
                })
            }
        </div>
    }
}
Report.propTypes={
    design:PropTypes.object.isRequired,
    data:PropTypes.object,
    param:PropTypes.object,
    onDone:PropTypes.func
}