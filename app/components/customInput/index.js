import React from 'react'
import { TouchableWithoutFeedback, View, Image, TextInput } from 'react-native';
import PropTypes from 'prop-types'
import styles from "./styles";

export default class CustomInput extends React.Component {

    static propTypes = {
        leftIcon: PropTypes.number,
        rightIcon: PropTypes.number,
        propComponent: PropTypes.object,
        style: PropTypes.object,
        onChangeText: PropTypes.func,
        focusStyle: PropTypes.object,
        isDot: PropTypes.bool
    }

    constructor(props) {
        super(props);
        this.state = {
            isFocused: false
        }
    }

    _onFocus() {
        this.setState({ isFocused: true })
        if(this.props.onFocus) this.props.onFocus();
    }

    _onBlur() {
        this.setState({ isFocused: false });
        if(this.props.onBlur) this.props.onBlur();
    }

    _rightAction() {
        this.props.onRightButton();
    }

    render() {
        const { isDot, leftIcon, rightIcon, propComponent, style, onChangeText, focusStyle, onRightButton } = this.props;
        let { isFocused } = this.state;
        return (
            <View style={[styles.container, style, (isFocused && focusStyle) ? focusStyle : {}]}>
                {leftIcon &&
                    <Image
                        source={leftIcon}
                        style={isDot ? styles.dotIcon : styles.icon}
                        resizeMode="contain" />
                }
                <TextInput
                    style={styles.input}
                    underlineColorAndroid="transparent"
                    {...propComponent}
                    onChangeText={(value) => onChangeText(value)}
                    onFocus={() => this._onFocus()}
                    onBlur={() => this._onBlur()} />
                {rightIcon &&
                    <Image
                        source={rightIcon}
                        style={styles.icon}
                        resizeMode="contain" />
                }
                {onRightButton &&
                    <TouchableWithoutFeedback onPress={this._rightAction.bind(this)}>
                        <Image
                            source={require("../../assets/icons/cancelIcon.png")}
                            style={styles.iconActionRight}
                            resizeMode="contain" />
                    </TouchableWithoutFeedback>
                }
            </View>
        )
    }
}