import React from 'react';
import {Common} from '../common';

export default function({design}){
    let attr=Common.putTextAttr(design);
    let p_attr={};
    ["verticalAlign","textAlign"].forEach(f=>{
        if(attr[f]){
            p_attr[f]=attr[f];
        }
    });
    let id=design.uuid||String(Math.random()*10000);
    return <div id={id} className="element staticText" style={{...attr,display:'table'}}>
        <p style={{...p_attr,display:'table-cell'}}>{design.text}</p>
    </div>
}