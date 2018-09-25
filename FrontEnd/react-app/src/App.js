import React, { Component } from 'react';
import './App.css';
import Router from "./app/router";
import {createStore} from "redux";
import {Provider} from "react-redux";
import reducers from './app/Redux/Reducers';

class App extends Component {
    constructor(props) {
        super(props);
        if(window.location.protocol.indexOf('http:') > -1 && window.location.host.indexOf('local') === -1) {
            window.location = 'https://' + window.location.host + window.location.pathname;
        }
    }

    render() {
        return (
            <Provider store={createStore(reducers)}>
                <Router/>
            </Provider>
        );
    }
}

export default App;
