import React from 'react';

export default class Viewer extends React.Component {
    constructor(props){
        super(props);
        this.state={
            name:"Viewer"
        };
    }
    render(){
        return <div>
            <h1>{this.state.name} works</h1>
        </div>
    }
}