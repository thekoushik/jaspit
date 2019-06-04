import React from 'react';
import PropTypes from 'prop-types';
import Report from './report';

function fetchAnyway(data,isURL,type){
    if(!isURL) return Promise.resolve(data);
    return fetch(data).then(res=>res[type]());
}

export default class Viewer extends React.Component {
    constructor(props){
        super(props);
        this.state={
            settings:{
                convert:true,
                fetch:null,
                design:null,
                data:null,
                param:null,
                done:null,
                ...props.settings
            },
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
    init=(settings)=>{
        let fetchWhat=settings.fetch;
        if(fetchWhat && fetchWhat !== 'none'){
            Promise.all([
                fetchAnyway(settings.design, (fetchWhat==="both" || fetchWhat==="design"), settings.convert?'text':'json'),
                fetchAnyway(settings.data, (fetchWhat==="both" || fetchWhat==="data"), 'json')
            ]).then((res)=>{
                this.load({
                    design:res[0],
                    data:res[1],
                    param:settings.param
                })
            })
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

Viewer.propTypes={
    settings:PropTypes.object.isRequired
}