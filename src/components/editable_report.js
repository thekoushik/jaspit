import React from 'react';
import PropTypes from 'prop-types';
import './report.css';
import Band from './band';
import { Common } from '../common';

const SECTIONS=[
    "title",
    "pageHeader",
    "columnHeader",
    "detail",
    "columnFooter",
    "pageFooter",
    "lastPageFooter",
    "summary"
];

export default class EditableReport extends React.Component {
    constructor(props){
        super(props);
        this.state=this.calcState(props);
        //console.log('jrjson',props.design)
    }
    calcState=({design,data,param})=>{
        //const height=Number(design.detail.band._attributes.height);
        Common.RATIO=824/Number(design._attributes.columnWidth);
        Common.YRATIO=1170/Number(design._attributes.pageHeight);
        //design.detail.band._attributes.height=String((Number( design.detail.band._attributes.height )+Number( design.pageFooter.band._attributes.height ))*Common.YRATIO);

        Common.param=param||{};
        Common.design=design;

        return {
            design,
        };
    }
    componentWillReceiveProps(props){
        this.setState(this.calcState(props));
    }
    onAdjust=(i)=>(data)=>{
        
    }
    render(){
        let {design}=this.state;
        return <div className="page-container">
            {
                SECTIONS.filter(f=>).map((m,i)=>{
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
Report.propTypes={
    design:PropTypes.object.isRequired,
    data:PropTypes.object,
    param:PropTypes.object,
    onDone:PropTypes.func
}