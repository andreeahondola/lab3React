import React, {Component} from 'react';
import {Text, View, TextInput, ActivityIndicator} from 'react-native';
import {saveDog, cancelSaveDog} from './service';
import {registerRightAction, issueToText, getLogger} from '../core/utils';
import styles from '../core/styles';

const log = getLogger('DogEdit');
const DOG_EDIT_ROUTE = 'dog/edit';

export class DogEdit extends Component {
    static get routeName() {
        return DOG_EDIT_ROUTE;
    }

    static get route() {
        return {name: DOG_EDIT_ROUTE, title: 'Dog Edit', rightText: 'Save'};
    }

    constructor(props) {
        log('constructor');
        super(props);
        this.store = this.props.store;
        const nav = this.props.navigator;
        this.navigator = nav;
        const currentRoutes = nav.getCurrentRoutes();
        const currentRoute = currentRoutes[currentRoutes.length - 1];
        if (currentRoute.data) {
            this.state = {dog: {...currentRoute.data}, isSaving: false};
        } else {
            this.state = {dog: {text: ''}, isSaving: false};
        }
        registerRightAction(nav, this.onSave.bind(this));
    }

    render() {
        log('render');
        const state = this.state;
        let message = issueToText(state.issue);
        return (
            <View style={styles.content}>
                { state.isSaving &&
                <ActivityIndicator animating={true} style={styles.activityIndicator} size="large"/>
                }
                <Text>Text</Text>
                <TextInput value={state.dog.text} onChangeText={(text) => this.updateDogText(text)}></TextInput>
                {message && <Text>{message}</Text>}
            </View>
        );
    }

    componentDidMount() {
        log('componentDidMount');
        this._isMounted = true;
        const store = this.props.store;
        this.unsubscribe = store.subscribe(() => {
            log('setState');
            const state = this.state;
            const dogState = store.getState().dog;
            this.setState({...state, issue: dogState.issue});
        });
    }

    componentWillUnmount() {
        log('componentWillUnmount');
        this._isMounted = false;
        this.unsubscribe();
        if (this.state.isLoading) {
            this.store.dispatch(cancelSaveDog());
        }
    }

    updateDogText(text) {
        let newState = {...this.state};
        newState.dog.text = text;
        this.setState(newState);
    }

    onSave() {
        log('onSave');
        this.store.dispatch(saveDog(this.state.dog)).then(() => {
            log('onDogSaved');
            if (!this.state.issue) {
                this.navigator.pop();
            }
        });
    }
}