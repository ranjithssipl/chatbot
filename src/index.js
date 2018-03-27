

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import Home from './Home'
import './window.js'

ReactDOM.render(
    // <Home />,
    <App message={(document.getElementById("root_value"))?document.getElementById("root_value").value:undefined} user={(document.getElementById("root_user"))?document.getElementById("root_user").value:undefined} />,
     document.getElementById('root')
    );
registerServiceWorker();





