import React from 'react';
import {Common} from '../../common';
import jrComponents from '../jrcomponents';

export default function({design,dataset,onAdjust}){
    let componentName=Object.keys(design).filter(f=>f!=="reportElement").pop();
    let JRComp=jrComponents[componentName];
    return <JRComp className="element" design={design[componentName]} dataset={dataset} onAdjust={onAdjust} style={{...Common.Attr2Style(design.reportElement),overflow:'visible'}} />
}