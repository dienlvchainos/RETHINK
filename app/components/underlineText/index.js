import React from 'react'
import { View, Text, TouchableWithoutFeedback } from 'react-native';
import PropTypes from 'prop-types'
import styles from "./styles";

export default class UnderlineText extends React.PureComponent {

    _press() {
        if (this.props.onPress) {
            this.props.onPress();
        }
    }

    render() {
        const { style, textStyle, children } = this.props;
        if (this.props.onPress) {
            return (
                <TouchableWithoutFeedback onPress={this._press.bind(this)}>
                    <View style={[styles.container, style]} >
                        {typeof children == 'string'
                            ? <Text style={textStyle}>{children}</Text>
                            : children
                        }
                    </View>
                </TouchableWithoutFeedback>
            )
        }
        return (
            <View style={[styles.container, style]} >
                {typeof children == 'string'
                    ? <Text style={textStyle}>{children}</Text>
                    : children
                }
            </View>
        )
    }
}

UnderlineText.propTypes = {
    textStyle: PropTypes.object,
    style: PropTypes.object,
    onPress: PropTypes.func
}

UnderlineText.defaultProps = {
    style: {}
}