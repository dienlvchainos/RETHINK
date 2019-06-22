import React from 'react'
import { View, Image, TouchableWithoutFeedback } from 'react-native';
import PropTypes from 'prop-types'
import styles from "./styles";

export default class FloatButton extends React.PureComponent {

    _onPress() {
        this.props.onPress();
    }

    render() {
        const { style, textStyle, icon, iconStyle } = this.props;
        return (
            <TouchableWithoutFeedback onPress={this._onPress.bind(this)}>
                <View style={[styles.container, style]} >
                    {icon && <Image source={icon}
                        style={[styles.iconStyle, iconStyle]}
                        resizeMode="contain" />
                    }
                </View>
            </TouchableWithoutFeedback>
        )
    }
}

FloatButton.propTypes = {
    textStyle: PropTypes.object,
    style: PropTypes.object,
    icon: PropTypes.number,
    iconStyle: PropTypes.object,
    onPress: PropTypes.func
}

FloatButton.defaultProps = {
    style: {},
    iconStyle: {}
}