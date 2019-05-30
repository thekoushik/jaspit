import React from 'react';
import './App.css';
import Importer from './components/loader';

function App() {
  return (
    <div className="Jaspit">
      <Importer jrxml="/invoice.jrxml" json="/invoice.json" param={{logo1:"/logo.jpg"}} />
    </div>
  );
}

export default App;
