import React from 'react';
import PropTypes from 'prop-types';
import './report.css';
import './editable_report.css';
import Band from '../../viewer/components/band';
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
        console.log('jrjson',props.design)
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
    componentDidMount(){
        Common.onElementClick=this.onElementClick.bind(this);
    }
    componentWillUnmount(){
        Common.onElementClick=null;
    }
    onAdjust=(i)=>(data)=>{
        
    }
    onElementClick=(id,design)=>{
        Common.elements[id].selected=!Common.elements[id].selected;
        //Common.elements[id].notify();
        console.log('click',design);
    }
    render(){
        let {design}=this.state;
        return <div className="page-container edit-mode">
                <div className="page" style={{...Common.Attr2Style(design),width:'824px'}}>
                {
                    SECTIONS.filter(f=>design[f]).map((m,i)=><Band key={i} name={m} design={design[m].band}/>)
                }
            </div>
        </div>
    }
}
EditableReport.propTypes={
    design:PropTypes.object.isRequired,
    onDone:PropTypes.func
}