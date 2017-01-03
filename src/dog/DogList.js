import React, {Component} from 'react';
import {ListView, Text, View, StatusBar, ActivityIndicator} from 'react-native';
import {DogEdit} from './DogEdit';
import {DogView} from './DogView';
import {loadDogs, cancelLoadDogs} from './service';
import {registerRightAction, getLogger, issueToText} from '../core/utils';
import styles from '../core/styles';

const log = getLogger('DogList');
const DOG_LIST_ROUTE = 'dog/list';

export class DogList extends Component {
    static get routeName() {
        return DOG_LIST_ROUTE;
    }

    static get route() {
        return {name: DOG_LIST_ROUTE, title: 'Dog List', rightText: 'New'};
    }

    constructor(props) {
        super(props);
        log('constructor');
        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id});
        this.store = this.props.store;
        const dogState = this.store.getState().dog;
        this.state = {isLoading: dogState.isLoading, dataSource: this.ds.cloneWithRows(dogState.items)};
        registerRightAction(this.props.navigator, this.onNewDog.bind(this));
    }

    render() {
        log('render');
        let message = issueToText(this.state.issue);
        return (
            <View style={styles.content}>
                { this.state.isLoading &&
                <ActivityIndicator animating={true} style={styles.activityIndicator} size="large"/>
                }
                {message && <Text>{message}</Text>}
                <ListView
                    dataSource={this.state.dataSource}
                    enableEmptySections={true}
                    renderRow={dog => (<DogView dog={dog} onPress={(dog) => this.onDogPress(dog)}/>)}/>
            </View>
        );
    }

    onNewDog() {
        log('onNewDog');
        this.props.navigator.push({...DogEdit.route});
    }

    onDogPress(dog) {
        log('onDogPress');
        this.props.navigator.push({...DogEdit.route, data: dog});
    }

    componentDidMount() {
        log('componentDidMount');
        this._isMounted = true;
        const store = this.store;
        this.unsubscribe = store.subscribe(() => {
            log('setState');
            const dogState = store.getState().dog;
            this.setState({dataSource: this.ds.cloneWithRows(dogState.items), isLoading: dogState.isLoading});
        });
        store.dispatch(loadDogs());
    }

    componentWillUnmount() {
        log('componentWillUnmount');
        this._isMounted = false;
        this.unsubscribe();
        if (this.state.isLoading) {
            this.store.dispatch(cancelLoadDogs());
        }
    }
}
