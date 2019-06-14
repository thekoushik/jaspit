import React from 'react';
import {Common} from '../common';

export default function({design,data,variable}){
    let attr=Common.putTextAttr(design);
    let p_attr={};
    ["verticalAlign","textAlign"].forEach(f=>{
        if(attr[f]){
            p_attr[f]=attr[f];
        }
    });
    if(design && design.attributes){
        if(design.attributes.whiteSpaceNowrap==="true")
            p_attr.whiteSpace='nowrap';
        else if(design.attributes.stretchType==="RelativeToTallestObject")
            p_attr.whiteSpace='nowrap';
    }
    let id=design.uuid||String(Math.random()*10000);
    return <div id={id} className="element textField" style={{...attr,display:'table'}}>
        <p style={{...p_attr,display:'table-cell'}}>
            {
                Common.parseExpr(design.textFieldExpression,data,{V:variable})
            }
        </p>
    </div>
}