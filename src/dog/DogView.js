import React, {Component} from 'react';
import {Text, View, StyleSheet, TouchableHighlight} from 'react-native';

export class DogView extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <TouchableHighlight onPress={() => this.props.onPress(this.props.dog)}>
                <View>
                    <Text style={styles.listItem}>{this.props.dog.text}</Text>
                </View>
            </TouchableHighlight>
        );
    }
}

const styles = StyleSheet.create({
    listItem: {
        margin: 10,
    }
});