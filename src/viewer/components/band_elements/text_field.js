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
    if(design.reportElement && design.reportElement._attributes){
        if(design.reportElement._attributes.isPrintWhenDetailOverflows==="true")
            p_attr.whiteSpace='nowrap';
        else if(design.reportElement._attributes.stretchType==="RelativeToTallestObject")
            p_attr.whiteSpace='nowrap';
    }
    let id=design.reportElement._attributes.uuid||String(Math.random()*10000);
    return <div id={id} className="element textField" style={{...attr,display:'table'}}>
        <p style={{...p_attr,display:'table-cell'}}>
            {
                Common.edit?design.textFieldExpression._cdata:Common.parseExpr(design.textFieldExpression._cdata,data,{V:variable})
            }
        </p>
    </div>
}