import React from 'react';
import {Common} from '../../common';

export default function({design,data}){
    let src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=";
    if(!Common.edit && design.imageExpression._cdata){
        let result=Common.parseExpr(design.imageExpression._cdata,data)
        if(result) src=result;
    }
    return <img className="element" src={src} alt={design.imageExpression._cdata} style={{...Common.Attr2Style(design.reportElement)}} />
}