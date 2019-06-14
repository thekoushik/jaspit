import React from 'react';
import {Common} from '../common';

export default function({design}){
    let direction = true;
    if(design.measurement && design.measurement.direction==="BottomUp"){
        direction=false;
    }
    let style=Common.Attr2Style(design);
    
    //return <div className="element line" style={{...Common.Attr2Style(design.reportElement)}}></div>
    let width=style.width.replace("px","");
    let height=style.height.replace("px","");
    return <svg className="element line2" viewBox={"0 0 "+width+" "+height} style={style}>
        {
            direction?<line x1="1" y1="0" x2={width} y2={height} strokeWidth="1" stroke="#000" />:<line x1={width} y1="0" x2="1" y2={height} strokeWidth="1" stroke="#000" />
        }
    </svg>
}