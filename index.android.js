import React, {Component} from 'react';
import {AppRegistry} from 'react-native';
import {createStore, applyMiddleware, combineReducers} from 'redux';
import createLogger from 'redux-logger';
import thunk from 'redux-thunk';
import {dogReducer} from "./src/dog";
import {authReducer} from "./src/auth";
import {Router} from "./src/Router";

const rootReducer = combineReducers({dog: dogReducer, auth: authReducer});
const store = createStore(rootReducer, applyMiddleware(thunk, createLogger({colors: {}})));

export default class DogAppRN extends Component {
    render() {
        return (
            <Router store={store}/>
        );
    }
}

AppRegistry.registerComponent('DogAppRN', () => DogAppRN);