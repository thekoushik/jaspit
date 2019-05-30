import React from 'react';
import ReactDOM from 'react-dom';
import {xml2js} from 'xml-js';
import './index.css';
//import App from './App';
//import * as serviceWorker from './serviceWorker';
import Loader from './components/loader';

export function init(settings){
    //ReactDOM.render(<App />, document.getElementById('root'));
    ReactDOM.render(<Loader settings={settings} converter={convert} />,document.getElementById(settings.dom_id))
}

export function convert(jrxml){
    return xml2js(jrxml,{compact: true}).jasperReport
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA

//serviceWorker.unregister();
