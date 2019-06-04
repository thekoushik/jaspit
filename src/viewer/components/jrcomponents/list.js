import React from 'react';
import Band from '../band';
import { Common } from '../common';

export default class List extends React.Component {
    constructor(props){
        super(props);
        this.state=this.makeState(props);
    }
    makeState=(props)=>{
        let subDatasetName=props.design.datasetRun._attributes.subDataset;
        return {
            subDatasetName,
            design:props.design["jr:listContents"],
            elementCount:-1,
            dataset:props.dataset[subDatasetName]//take the dataset
        }
    }
    componentWillReceiveProps(props){
        this.setState(this.makeState(props));
    }
    componentDidMount(){
        //console.log('list mounted at page',this.props.variable.PAGE_NUMBER)
        //this.setState({elementCount:Math.floor(this.element.parentElement.clientHeight/this.element.clientHeight)});
        this.doUpdate()
    }
    doUpdate=()=>{
        let parentHeight=this.element.parentElement.clientHeight;
        if(this.element.parentElement.style.maxHeight)
            parentHeight=Number(this.element.parentElement.style.maxHeight.replace("px",""));
        let elementCount=Math.floor(parentHeight/this.element.clientHeight);
        let {dataset,subDatasetName}=this.state;
        //console.log('dataset',dataset);
        let expectedEnd=dataset.start+elementCount;
        if(expectedEnd!==dataset.end){
            this.props.onAdjust({ subDatasetName, end: expectedEnd});
        }else{
            let {PAGE_NUMBER,PAGE_COUNT}=this.props.variable;
            if(PAGE_NUMBER===PAGE_COUNT)
                this.props.onAdjust();//this page is complete
        }
    }
    componentDidUpdate(){
        if(Common.complete) return;
        //console.log('list updating of page',this.props.variable.PAGE_NUMBER)
        this.doUpdate()
        /*
        let parentHeight=this.element.parentElement.clientHeight;
        if(this.element.parentElement.style.maxHeight)
            parentHeight=Number(this.element.parentElement.style.maxHeight.replace("px",""));
        let elementCount=Math.floor(parentHeight/this.element.clientHeight);
        if(elementCount!==this.state.elementCount){
            this.setState({elementCount});
        }else{
            let {dataset,subDatasetName}=this.state;
            console.log('dataset',dataset);
            let expectedEnd=dataset.start+elementCount;
            if(expectedEnd!==dataset.end){
                this.props.onAdjust({ subDatasetName, end: expectedEnd});
            }
        }
        */
    }
    render(){
        let {design}=this.state;
        if(Common.edit){
            return <div name="list" id={this.props.id} ref={el=>this.element=el} className={this.props.className} style={this.props.style}>
                <Band design={design} />
            </div>
        }else{
            let {subDatasetName,dataset}=this.state;
            let subDataset=(Array.isArray(Common.design.subDataset)?Common.design.subDataset:[Common.design.subDataset]).filter(f=>f._attributes.name===subDatasetName).pop();
            let data=(Array.isArray(Common.dataset[subDatasetName])?Common.dataset[subDatasetName]:[Common.dataset[subDatasetName]]).slice(dataset.start,dataset.end);
            return <div name="list" id={this.props.id} ref={el=>this.element=el} className={this.props.className} style={this.props.style}>
                {
                    data.map((m,i)=><Band key={i} design={design} data={Common.compileData(subDataset,m)} onAdjust={this.props.onAdjust} variable={{REPORT_COUNT:(dataset.start+i+1)}} />)
                }
            </div>
        }
    }
}