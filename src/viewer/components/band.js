import React from 'react';
import bandElements from './band_elements';
import {Common} from './common';

export default class Band extends React.Component {
    constructor(props){
        super(props);
        this.state={
            name:props.name,
            design:props.design,
            data:props.data || Common.data,
            dataset:props.dataset || Common.dataset,
            variable:props.variable||{}
        };
    }
    componentWillReceiveProps(props){
        this.setState({
            name:props.name,
            design:props.design,
            data:props.data|| Common.data,
            dataset:props.dataset || Common.dataset,
            variable:props.variable||{}
        });
    }
    putBand=(name,design)=>{
        return makeBand(name,design,this.state.dataset,this.state.data,this.state.variable,this.onAdjust);
    }
    onAdjust=(data)=>{
        this.props.onAdjust && this.props.onAdjust(data);
    }
    render(){
        let {design,name}=this.state;
        let style={};
        if(design._attributes) style=Common.Attr2Style(design);
        let items=[];
        for(let key in bandElements)
            if(design[key])
                items.push(this.putBand(key,design[key]))
        return <div name={name} style={{position:'relative',...style,...(this.props.style||{})}}>
            {items}
        </div>
    }
}
export function makeBand(name,design,dataset,data,variable,onAdjust){
    let data_items=Array.isArray(design)?design:[design];
    let BandElement=bandElements[name];
    return data_items.map((m,i)=>{
        let printWhenExpression=true;
        if(m.reportElement){
            if(m.reportElement.printWhenExpression){
                printWhenExpression=Boolean(Common.parseExpr(m.reportElement.printWhenExpression._cdata,data,{V:variable}))
            }
        }
        return printWhenExpression?<BandElement key={i} design={m} data={data} dataset={dataset} onAdjust={onAdjust} variable={variable} />:null;
    });
}