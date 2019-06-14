import React from 'react';
import {Common} from '../../common';
import list from './list';

const components={
    list
};

export default function({design,dataset,onAdjust,variable}){
    let Comp=components[design.elementName];
    let id=design.uuid||String(Math.random()*10000);
    return <Comp id={id} className="element" design={design.element} dataset={dataset} onAdjust={onAdjust} variable={variable} style={{...Common.Attr2Style(design),overflow:'visible'}} />
}