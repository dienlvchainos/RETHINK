import React from 'react'
import { View, Text, TouchableWithoutFeedback } from 'react-native';
import PropTypes from 'prop-types'
import styles from "./styles";
import { Fonts } from '../../utils/styleUtils';

export default class SimpleButton extends React.Component {

    static propTypes = {
        propComponent: PropTypes.object,
        textStyle: PropTypes.object,
        onPress: PropTypes.func,
        style: PropTypes.object,
        containerStyle: PropTypes.object
    }

    _onPress() {
        this.props.onPress()
    }

    render() {
        const { children, style, propComponent, textStyle, containerStyle } = this.props;
        return (
            <TouchableWithoutFeedback onPress={this._onPress.bind(this)} {...propComponent}>
                <View style={[styles.container, style, containerStyle]}>
                    <Text style={[styles.text, textStyle]}>{children}</Text>
                </View>
            </TouchableWithoutFeedback>
        )
    }
}