import React from 'react';
import {Common} from '../common';

export default function({design,data}){
    let src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=";
    if(design.imageExpression){
        let result=Common.parseExpr(design.imageExpression,data)
        if(result) src=result;
    }
    let id=design.uuid||String(Math.random()*10000);
    return <img id={id} className="element" src={src} alt={design.imageExpression} style={{...Common.Attr2Style(design)}} />
}