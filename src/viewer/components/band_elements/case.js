import React from 'react';
import bandElements from '../band_elements';
import {makeBand} from '../band';
import {Common} from '../common';

export default function({design,data,dataset,variable}){
    if(!Common.parseExpr(design.caseExpression._cdata,data,{V:variable})) return null
    let items=[];
    for(let key in bandElements)
        if(design[key])
            items.push(makeBand(key,design[key],dataset,data,variable))
    let style={}
    if(design.reportElement)
        style=Common.Attr2Style(design.reportElement);
    return <div name="case" style={{position:'relative',...style,top:'0px',float:'left'}}>
        {items}
    </div>
}