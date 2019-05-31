import React from 'react';
import PropTypes from 'prop-types';
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
    load=({design,data,param})=>{
        let state={
            design:this.state.settings.convert?this.props.converter(design):design,// xml2js(design,{compact: true}).jasperReport,
            data,
            param:param||{}
        };
        this.setState(state)
    }
    fetchAndInit=()=>{
        let {design,data,param,convert}=this.state.settings;
        Promise.all([fetch(design), fetch(data)])
        .then((res) =>{
            return Promise.all([res[0][convert?'text':'json'](),res[1].json()]) ;
        })
        .then(([xml,json])=> {
            this.load({design:xml,data:json,param});
        });
    }
    init=(settings)=>{
        if(settings.fetch){
            this.fetchAndInit();
        }else{
            this.load(settings);
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

Loader.propTypes={
    settings:PropTypes.object.isRequired
}