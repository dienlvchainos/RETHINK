import React from 'react'
import { View } from 'react-native';
import styles from "./styles";

export default class Divide extends React.Component {

    render() {
        const { style, color } = this.props;
        return (
            <View style={[styles.container, style, { backgroundColor: color}]} />
        )
    }
}