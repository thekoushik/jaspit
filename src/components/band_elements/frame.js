import React from 'react';
import bandElements from '.';
import {makeBand} from '../band';
import {Common} from '../../common';

export default function({design,data,dataset,variable}){
    let items=[];
    for(let key in bandElements)
        if(design[key])
            items.push(makeBand(key,design[key],dataset,data,variable))
    let style={}
    if(design.reportElement) style=Common.Attr2Style(design.reportElement);
    return <div name="frame" style={{position:'relative',...style}}>
        {items}
    </div>
}