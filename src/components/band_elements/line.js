import React from 'react';
import {Common} from '../../common';

export default function({design}){
    return <div className="element line" style={{...Common.Attr2Style(design.reportElement)}}></div>
}