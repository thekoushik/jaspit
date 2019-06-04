import React from 'react';
import {Common} from '../common';
import jrComponents from '../jrcomponents';

export default function({design,dataset,onAdjust,variable}){
    let componentName=Object.keys(design).filter(f=>f!=="reportElement").pop();
    let JRComp=jrComponents[componentName];
    let id=design.reportElement._attributes.uuid||String(Math.random()*10000);
    return <JRComp id={id} className="element" design={design[componentName]} dataset={dataset} onAdjust={onAdjust} variable={variable} style={{...Common.Attr2Style(design.reportElement),overflow:'visible'}} />
}