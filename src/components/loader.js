import React from 'react';
import Report from './report';

export default class Loader extends React.Component {
    constructor(props){
        super(props);
        this.state={
            settings:{convert:true,...props.settings},
            param:null,
            design:null,
            data:null,
        };
    }
    componentDidMount(){
        this.init(this.state.settings);
    }
    load=({design,json,param})=>{
        let state={
            design:this.state.settings.convert?this.props.converter(design):design,// xml2js(design,{compact: true}).jasperReport,
            data:json,
            param:param
        };
        if(param) state.param=param;
        this.setState(state)
    }
    fetchAndInit=()=>{
        let {jrxml,json,param,convert}=this.state.settings;
        Promise.all([fetch(jrxml), fetch(json)])
        .then((res) =>{
            return Promise.all([res[0][convert?'text':'json'](),res[1].json()]) ;
        })
        .then(([xml,json])=> {
            this.load({design:xml,json,param});
        });
    }
    init=(settings)=>{
        if(settings.fetch){
            this.fetchAndInit();
        }else{
            this.load({design:settings.jrxml,json:settings.json,param:settings.param});
        }
    }
    onDone=(pagecount)=>{
        this.state.settings.done && this.state.settings.done(pagecount);
    }
    render(){
        return <div style={{width2:'838px'}}>
            {
                this.state.design?<Report onDone={this.onDone} design={this.state.design} data={this.state.data} param={this.state.param} />:null
            }
        </div>
    }
}
