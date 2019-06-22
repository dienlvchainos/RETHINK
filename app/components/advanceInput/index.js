import React from 'react'
import { TouchableWithoutFeedback, View, Image, TextInput, Keyboard, Switch } from 'react-native';
import PropTypes from 'prop-types'
import DateTimePicker from 'react-native-modal-datetime-picker';
import styles from "./styles";
import StandardText from '../standardText';
import { scale } from '../../utils/scalingUtils';
import moment from 'moment';
import { Fonts } from '../../utils/styleUtils';

export default class AdvanceInput extends React.Component {

    static propTypes = {
        title: PropTypes.string,
        rightIcon: PropTypes.number,
        propComponent: PropTypes.object,
        style: PropTypes.object,
        onChangeText: PropTypes.func,
        focusStyle: PropTypes.object,
        isDatePicker: PropTypes.bool,
        isSwitch: PropTypes.bool,
        onRightAction: PropTypes.func,
        isDot: PropTypes.bool,
        initPosition: PropTypes.any
    }

    static defaultProps = {
        isDot: false
    }

    constructor(props) {
        super(props);
        this.state = {
            isFocused: false,
            isDateTimePickerVisible: false,
            dateData: null
        }
    }

    _onFocus() {
        if (this.props.isDatePicker) {
            Keyboard.dismiss();
            this.setState({ isDateTimePickerVisible: true });
        }
        if (this.props.onFocus) {
            this.props.onFocus();
        }
        this.setState({ isFocused: true })
    }

    _onBlur() {
        if (this.props.isDatePicker) {
            this.setState({ isDateTimePickerVisible: false })
        }
        this.setState({ isFocused: false })
    }

    _picker() {
        this.setState({ isDateTimePickerVisible: true })
    }

    _handleDatePicked(date) {
        let dateData = (this.props.mode && this.props.mode == 'datetime') ? moment(date).format('YYYY-MM-DD HH:mm') : moment(date).format('YYYY-MM-DD')
        this.setState({ dateData, isDateTimePickerVisible: false });
        this.props.onDateReturn(dateData);
    }

    _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

    _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

    _goRightAction() {
        this.props.onRightAction()
    }

    _onSwitch = (data) => {
        this.props.onSwitch(this.props.switchValue);
    }

    _focusInput() {
        this.refInput.focus()
    }

    render() {
        const { title, rightIcon, propComponent, style, onChangeText, focusStyle, isDatePicker, onRightAction, initDate, isDot } = this.props;
        let { isFocused } = this.state;
        return (
            <View style={[styles.container, style, (isFocused && focusStyle) ? focusStyle : {}]}>
                {isDot && <Image
                    source={require("../../assets/icons/dotIcon.png")}
                    style={styles.dotIcon}
                    resizeMode="contain" />
                }
                <StandardText title>{title}</StandardText>
                {!this.props.onSwitch
                    ? this.props.hintText ? <View style={styles.inRow}>
                        <TextInput
                            ref={(input) => { this.refInput = input; }}
                            style={[styles.input, { flex: 2.7, textAlign: 'right' }]}
                            underlineColorAndroid="transparent"
                            {...propComponent}
                            onChangeText={(value) => !isDatePicker ? onChangeText(value) : null}
                            value={this.props.value}
                            onFocus={() => this._onFocus()}
                            onBlur={() => this._onBlur()} />
                        <TouchableWithoutFeedback onPress={this._focusInput.bind(this)}>
                            <View style={styles.hintText}>
                                <StandardText>{this.props.hintText}</StandardText>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                        : <TextInput
                            style={styles.input}
                            underlineColorAndroid="transparent"
                            {...propComponent}
                            onChangeText={(value) => !isDatePicker ? onChangeText(value) : null}
                            value={this.props.value}
                            onFocus={() => this._onFocus()}
                            onBlur={() => this._onBlur()} />
                    : <Switch onValueChange={this._onSwitch.bind(this)} value={this.props.switchValue} />
                }
                {isDatePicker && <DateTimePicker
                    mode={this.props.mode ? this.props.mode : 'date'}
                    datePickerModeAndroid="spinner"
                    date={initDate}
                    minimumDate={this.props.minimumDate ? this.props.minimumDate : undefined}
                    maximumDate={this.props.maximumDate ? this.props.maximumDate : undefined}
                    isVisible={this.state.isDateTimePickerVisible}
                    onConfirm={this._handleDatePicked.bind(this)}
                    onCancel={this._hideDateTimePicker.bind(this)}
                />}
                {rightIcon &&
                    <TouchableWithoutFeedback onPress={this._picker.bind(this)}>
                        <Image
                            source={rightIcon}
                            style={styles.icon}
                            resizeMode="contain" />
                    </TouchableWithoutFeedback>
                }
                {onRightAction &&
                    <TouchableWithoutFeedback onPress={this._goRightAction.bind(this)}>
                        <View style={styles.viewRightAction}>
                            <View style={[styles.itemRightAction, { backgroundColor: this.props.rightActionColor }]} />
                            <StandardText small style={{ ...Fonts.NanumBarunGothic_Bold, marginLeft: scale(5) }}>색상</StandardText>
                        </View>
                    </TouchableWithoutFeedback>
                }
            </View>
        )
    }
}