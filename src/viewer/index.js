import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Viewer from './components';
import converter from './converter';

export function render(settings){
    let element=document.getElementById(settings.dom_id);
    if(element.children.length){
        try{
            ReactDOM.unmountComponentAtNode(element);
        }catch(e){
            console.warn("Error occured while clearing existing element body, it can be ignored",e)
        }
    }
    ReactDOM.render(<Viewer settings={settings} converter={converter} />,element)
}

export function convert(jrxml){
    return converter(jrxml);
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA

//serviceWorker.unregister();
