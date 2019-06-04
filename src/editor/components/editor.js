import React from 'react';
import PropTypes from 'prop-types';
import { Common } from '../common';
import Report from './editable_report';

export default class Editor extends React.Component {
    constructor(props){
        super(props);
        this.state=this.makeState(props.settings);
        Common.edit=true;
    }
    makeState=(settings)=>{
        return {
            design:settings.design
        }
    }
    componentWillReceiveProps(props){
        if(props.settings.design!==this.state.design)
            this.setState(this.makeState(props.settings))
    }
    render(){
        return <div style={{width2:'838px'}}>
            {
                <Report design={this.state.design} />
            }
        </div>
    }
}
Editor.propTypes={
    settings:PropTypes.object.isRequired
}