import React from 'react';
import bandElements from '../band_elements';
import {makeBand} from '../band';
import {Common} from '../common';

export default function({design,data,dataset,variable}){
    let items=[];
    for(let key in bandElements)
        if(design[key])
            items.push(makeBand(key,design[key],dataset,data,variable))
    let style={}
    if(design.measurement) style=Common.Attr2Style(design.measurement);
    return <div name="frame" style={{position:'relative',...style}}>
        {items}
    </div>
}