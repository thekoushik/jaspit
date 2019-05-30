import React from 'react';
import jrComponents from './jrcomponents';
import {Common} from '../common';

export default class Band extends React.Component {
    constructor(props){
        super(props);
        this.state={
            name:props.name,
            design:props.design,
            data:props.data || Common.data,
            dataset:props.dataset,
            variable:props.variable||{}
        };
    }
    componentWillReceiveProps(props){
        this.setState({
            name:props.name,
            design:props.design,
            data:props.data|| Common.data,
            dataset:props.dataset,
            variable:props.variable||{}
        });
    }
    BAND_ITEM={
        staticText:(_data)=>{
            let data=Array.isArray(_data)?_data:[_data];
            return data.map((m,i)=>{
                let attr=Common.putTextAttr(m);
                let p_attr={};
                ["verticalAlign","textAlign"].forEach(f=>{
                    if(attr[f]){
                        p_attr[f]=attr[f];
                    }
                });
                return <div key={i} className="element staticText" style={{...attr,display:'table'}}>
                    <p style={{...p_attr,display:'table-cell'}}>{m.text._cdata}</p>
                </div>
            })
        },
        textField:(_data)=>{
            let data=Array.isArray(_data)?_data:[_data];
            return data.map((m,i)=>{
                let attr=Common.putTextAttr(m);
                let p_attr={};
                ["verticalAlign","textAlign"].forEach(f=>{
                    if(attr[f]){
                        p_attr[f]=attr[f];
                    }
                });
                if(m.reportElement && m.reportElement._attributes){
                    if(m.reportElement._attributes.isPrintWhenDetailOverflows==="true")
                        p_attr.whiteSpace='nowrap';
                    else if(m.reportElement._attributes.stretchType==="RelativeToTallestObject")
                        p_attr.whiteSpace='nowrap';
                }
                return <div key={i} className="element textField" style={{...attr,display:'table'}}>
                    <p style={{...p_attr,display:'table-cell'}}>
                        {Common.parseExpr(m.textFieldExpression._cdata,this.state.data,{V:this.state.variable})}
                    </p>
                </div>
            });
        },
        line:(_data)=>{
            let data=Array.isArray(_data)?_data:[_data];
            return data.map((m,i)=><div key={i} className="element line" style={{...Common.Attr2Style(m.reportElement)}}></div>)
        },
        image:(_data)=>{
            let data=Array.isArray(_data)?_data:[_data];
            return data.map((m,i)=>{
                let src=m.imageExpression._cdata.trim()?Common.parseExpr(m.imageExpression._cdata,this.state.data):"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=";
                if(!src) src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=";
                return <img key={i} className="element"
                    src={src} alt={m.imageExpression._cdata}
                style={{...Common.Attr2Style(m.reportElement)}} />
            })
        },
        rectangle:(_data)=>{
            let data=Array.isArray(_data)?_data:[_data];
            return data.map((m,i)=>{
                let attr=m.reportElement._attributes;
                let lines=[{...attr,width:"1"},{...attr,height:"1"},{...attr,x:String(Number(attr.x)+Number(attr.width)),width:"1"},{...attr,y:String(Number(attr.y)+Number(attr.height)),height:"1"}];
                return <div key={i}>
                    {
                        lines.map((l,j)=><div key={j} className="element line rectangle" style={{...Common.Attr2Style({_attributes:l})}}></div>)
                    }
                </div>
            })
        },
        componentElement:(_data)=>{
            let data=Array.isArray(_data)?_data:[_data];
            return data.map((m,i)=>{
                let componentName=Object.keys(m).filter(f=>f!=="reportElement").pop();
                let JRComp=jrComponents[componentName];
                return <JRComp key={i} className="element" design={m[componentName]} dataset={this.state.dataset} onAdjust={this.onAdjust} style={{...Common.Attr2Style(m.reportElement),overflow:'visible'}} />
            });
        }
    }
    onAdjust=(data)=>{
        this.props.onAdjust && this.props.onAdjust(data);
    }
    render(){
        let {design,name}=this.state;
        let style={};
        if(design._attributes) style=Common.Attr2Style(design);
        let items=[];
        for(let key in design)
            if(this.BAND_ITEM[key])
                items.push(this.BAND_ITEM[key](design[key]))
        return <div name={name} style={{position:'relative',...style}}>
            {items}
        </div>
    }
}