import React from 'react';
import Band from '../band';
import { Common } from '../../common';

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
        let elementCount=Math.floor(this.element.parentElement.clientHeight/this.element.clientHeight);
        this.setState({elementCount});
    }
    componentDidUpdate(){
        if(Common.edit) return;
        let elementCount=Math.floor(this.element.parentElement.clientHeight/this.element.clientHeight);
        if(elementCount!==this.state.elementCount){
            this.setState({elementCount});
        }else{
            let {dataset,subDatasetName}=this.state;
            let expectedEnd=dataset.start+elementCount;
            if(expectedEnd!==dataset.end){
                this.props.onAdjust({ subDatasetName, end: expectedEnd});
            }
        }
    }
    render(){
        if(Common.edit){
            return <div ref={el=>this.element=el} className={this.props.className} style={this.props.style}>
                <Band design={this.state.design} />
            </div>
        }else{
            let {subDatasetName,dataset}=this.state;
            let subDataset=(Array.isArray(Common.design.subDataset)?Common.design.subDataset:[Common.design.subDataset]).filter(f=>f._attributes.name===subDatasetName).pop();
            let data=(Array.isArray(Common.dataset[subDatasetName])?Common.dataset[subDatasetName]:[Common.dataset[subDatasetName]]).slice(dataset.start,dataset.end);
            return <div ref={el=>this.element=el} className={this.props.className} style={this.props.style}>
                {
                    data.map((m,i)=><Band key={i} design={this.state.design} data={Common.compileData(subDataset,m)} onAdjust={this.props.onAdjust} variable={{REPORT_COUNT:(dataset.start+i+1)}} />)
                }
            </div>
        }
    }
}