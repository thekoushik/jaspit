import React from 'react';
import {makeBand} from '../band';
import {Common} from '../common';

export default function({design,data,dataset,variable}){
    let caseElements=[];
    if(design.case){
        caseElements=(Array.isArray(design.case)?design.case:[design.case])
            .map(m=>makeBand('case',m,dataset,data,variable));
    }
    let style={}
    if(design.reportElement) style=Common.Attr2Style(design.reportElement);
    return <div name="switch" style={{position:'relative',...style}}>
        {caseElements}
    </div>
}