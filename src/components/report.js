import React from 'react';
import './report.css';
import Band from './band';
import { Common } from '../common';

export default class Report extends React.Component {
    constructor(props){
        super(props);
        this.state=this.calcState(props);
        //console.log('jrjson',props.design)
    }
    calcState=({design,data,param})=>{
        //const height=Number(design.detail.band._attributes.height);
        Common.RATIO=824/Number(design._attributes.columnWidth);
        Common.YRATIO=1170/Number(design._attributes.pageHeight);
        design.detail.band._attributes.height=String((Number( design.detail.band._attributes.height )+Number( design.pageFooter.band._attributes.height ))*Common.YRATIO);

        Common.param=param||{};
        Common.design=design;
        Common.dataset=data;
        Common.data=Common.compileData(design,data);
        let pages=[Common.processSubDataSet(design)];
        return {
            design,
            pages
        };
    }
    componentWillReceiveProps(props){
        this.setState(this.calcState(props));
    }
    onAdjust=(i)=>(data)=>{
        let {pages}=this.state;
        pages[i][data.subDatasetName].end=data.end;
        let diff=Common.dataset[data.subDatasetName].length-data.end
        if(diff>0)
            pages.push(Common.createSubDataSetFromPrevious(pages[i],data.subDatasetName));
        Common.data.V.PAGE_COUNT=pages.length;
        this.setState({pages});
        if(Common.isDone(pages)) this.props.onDone(pages.length);
    }

    render(){
        let {design,pages}=this.state;
        return <div className="page-container">
            {
                pages.map((m,i)=>{
                    let lastBandName=i===pages.length-1?'lastPageFooter':'pageFooter';
                    let newDetailBandDesign={...design.detail.band};
                    return <div key={i} className="page" style={{...Common.Attr2Style(design),width:'824px'}}>
                        <Band name="pageHeader" design={design.pageHeader.band} variable={{PAGE_NUMBER:(i+1)}} />
                        <Band name="columnHeader" design={design.columnHeader.band} variable={{PAGE_NUMBER:(i+1)}} />
                        <Band name="detail" design={newDetailBandDesign} dataset={m} onAdjust={this.onAdjust(i)} />
                        <Band name="lastBandName" design={design[lastBandName].band} variable={{PAGE_NUMBER:(i+1)}} />
                    </div>
                })
            }
        </div>
    }
}