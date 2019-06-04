import React from 'react';
import {Common} from '../common';

export default function({design}){
    let attr=design.reportElement._attributes;
    let lines=[{...attr,width:"1"},{...attr,height:"1"},{...attr,x:String(Number(attr.x)+Number(attr.width)),width:"1"},{...attr,y:String(Number(attr.y)+Number(attr.height)),height:"1"}];
    return <>
        {
            lines.map((l,j)=><div key={j} className="element line rectangle" style={{...Common.Attr2Style({_attributes:l})}}></div>)
        }
    </>
}