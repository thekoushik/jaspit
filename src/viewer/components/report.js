import React from 'react';
import {findDOMNode} from 'react-dom';
import PropTypes from 'prop-types';
import './report.css';
import Band from './band';
import { Common } from './common';

export default class Report extends React.Component {
    constructor(props){
        super(props);
        //console.log('jrjson',props.design)
        this.state=this.calcState(props);
    }
    calcState=({design,data,param})=>{
        Common.RATIO=824/Number(design.measurement.width);//columnWidth
        Common.YRATIO=1170/Number(design.measurement.height);//pageHeight

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
        if(design.bands.lastPageFooter!==undefined){
            if(design.bands.lastPageFooter.measurement.height!=="0")
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
                    let backgroundBand=design.bands.background?<Band name="background" design={design.bands.background} style={{position:'absolute',height:pageAttr.style.height}} variable={variable} />:null
                    if(m==="summary")
                        return <div key={i} {...pageAttr}>
                            { backgroundBand }
                            <Band ref="summaryBand" name="summary" design={design.bands.summary} dataset={m} variable={variable} style={{maxWidth}} />
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
                    let availableHeight=Common.val(design.measurement.height,true);
                    if(isFirst && design.bands.title) availableHeight-=Common.val(design.bands.title.measurement.height,true);
                    if(design.bands.pageHeader) availableHeight-=Common.val(design.bands.pageHeader.measurement.height,true);
                    if(design.bands.columnHeader) availableHeight-=Common.val(design.bands.columnHeader.measurement.height,true);
                    if(design.bands.columnFooter) availableHeight-=Common.val(design.bands.columnFooter.measurement.height,true);
                    if(design.bands[lastBandName]){
                        columnFooterBottom=Common.val(design.bands[lastBandName].measurement.height,true);
                        availableHeight-=columnFooterBottom;
                    }
                    let bottomToAdd=Common.val(design.measurement.paddingBottom,true);
                    return <div key={i} {...pageAttr}>
                        { backgroundBand }
                        {
                            isFirst && design.bands.title ? <Band name="title" design={design.bands.title} variable={variable} style={{maxWidth}} />:null
                        }
                        {
                            ["pageHeader","columnHeader"].filter(f=>design.bands[f])
                            .map((n,j)=><Band key={j} name={n}
                                design={design.bands[n]} dataset={m} variable={variable} onAdjust={this.onAdjust(i)}
                                style={{maxWidth}} />)
                        }
                        {
                            design.bands.detail?<Band {...(isLast?{ ref:"lastPageDetailBand"}:{})} name="detail" design={design.bands.detail} dataset={m} variable={variable} onAdjust={this.onAdjust(i)} style={{height:(isLast?this.state.lastPageDetailBandHeight:'auto'),maxHeight:availableHeight+"px",maxWidth}} />:null
                        }
                        {
                            isLast && design.bands.summary && !lastPageOnlySummary?<Band ref="summaryBand" name="summary" design={design.bands.summary} dataset={m} variable={variable} style={{maxWidth}} />:null
                        }
                        {
                            design.bands.columnFooter?<Band name="columnFooter" design={design.bands.columnFooter} dataset={m} variable={variable} style={{position:'absolute',width:'100%',bottom:(bottomToAdd+columnFooterBottom)+'px',maxWidth}} />:null
                        }
                        {
                            design.bands[lastBandName]?<Band name={lastBandName} design={design.bands[lastBandName]} variable={variable} style={{position:'absolute',width:'100%',bottom: bottomToAdd+'px',maxWidth}}  />:null
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