import React from 'react'
import { TouchableWithoutFeedback, Image, View, Keyboard, KeyboardAvoidingView } from 'react-native'
import BaseScreen from '../baseScreen'
import { Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import styles from './styles';
import Header from "../../components/header";
import StandardText from '../../components/standardText';
import AdvanceInput from '../../components/advanceInput';
import { _renderButtonText, _asyncForEach, _handleDateObject } from '../../helpers';
import { _detectReminder, _detectRepeat } from '../../utils/dateUtils';
import { _timeoutCancelHandling } from '../../helpers';
import { _createNotification } from '../../utils/notifyUtils';
import constants from '../../constants';
import PopupRepeatEvent from '../calendar/popupRepeatEvent';
import SimpleButton from '../../components/simpleButton';
import LoadingScreen from '../../components/loadingScreen';
import { buttonColor, mainColor } from "../../utils/styleUtils";
import SuggestComponent from '../../components/suggestComponent';
import { scale } from '../../utils/scalingUtils';
import sf from '../../libs/serviceFactory';
import notice from "../../utils/noticeUtils";
import { _formatMoney } from '../../helpers';
import noticeUtils from '../../utils/noticeUtils';
import moment from 'moment';
import ModalDropdown from 'react-native-modal-dropdown';

class CreateEvent extends BaseScreen {

    constructor(props) {
        super(props)
        this.state = {
            switchValue: false,
            buttonRect: {},
            isSuggestLocation: false,
            optionLocationSelected: true,
            optionNoteSelected: true,
            isRepeatModalVisible: false,
            locations: [],
            reminderSelected: this._reminders[2],
            activity: {
                start_at: '',
                end_at: '',
                name: '',
                child_id: '',
                reminder: '10m',
                notification_repeat: 'none',
                notification: 1,
                location: '',
                note: ''
            },
        }
    }

    _options = [
        { id: 0, icon: require('../../assets/icons/locationPoint.png'), title: '장소 ' },
        { id: 1, icon: require('../../assets/icons/educationIcon.png'), title: '메모 ' },
        { id: 2, icon: require('../../assets/icons/exchangeIcon.png'), title: '반복 ' }
    ]

    _reminders = [
        { id: 0, title: '정시', value: 'once' }, { id: 1, title: '5분 전', value: '5m' }, { id: 2, title: '10분 전', value: '10m' }, { id: 3, title: '15분 전', value: '15m' },
        { id: 4, title: '30분 전', value: '30m' }, { id: 5, title: '1시간 전', value: '1h' }, { id: 6, title: '2시간 전', value: '2h' }, { id: 7, title: '3시간 전', value: '3h' },
        { id: 8, title: '12시간 전 전', value: '12h' }, { id: 9, title: '1일 전', value: '1d' }, { id: 10, title: '2일 전', value: '2d' }, { id: 11, title: '1주 전', value: '1w' }
    ]

    _renderRowReminderPicker = (item, index, isSelected) => {
        return <View style={[styles.itemOptionPicker, isSelected ? { backgroundColor: buttonColor.bgInactive } : {}]}>
            <StandardText title regular style={{ marginLeft: scale(3) }}>{item.title}</StandardText>
        </View>
    }

    _renderRowOptionPicker = (item, index) => {
        return <TouchableWithoutFeedback onPress={() => this._selectOption(item)}>
            <View style={styles.itemOptionPicker}>
                <Image source={item.icon}
                    style={styles.iconOptionPicker}
                    resizeMode="contain" />
                <StandardText title regular style={{ marginLeft: scale(3) }}>{item.title}</StandardText>
            </View>
        </TouchableWithoutFeedback>
    }

    _handleOutside() {
        Keyboard.dismiss();
    }

    _goPickMoreOption() {
        this._pickerOption.show();
    }

    _goPickReminder() {
        this._pickerReminder.show();
    }

    _setDate(_type, date) {
        let dateData = moment(date).format('YYYY-MM-DD HH:mm');
        this._setActivity(_type, dateData);
    }

    async _searchAddress(_address) {
        this._setActivity("location", _address);
        let position = this.props.location;
        if (position.latitude && position.longitude) {
            let coordinate = `${position.longitude.toString()},${position.latitude.toString()}`;
            // let coordinate = '127.1054328,37.3595963';
            let respon = await sf.getServices('UserService')._naverSearchAddress(_address, coordinate);
            if (respon && respon.data && respon.status == 200 && respon.data.status == 'OK') {
                let locations = respon.data.places.filter((p) => p.road_address != '').map((p) => {
                    return {
                        address: p.road_address
                    }
                })
                this.setState({ locations });
                if (!this.state.isSuggestLocation) this.setState({ isSuggestLocation: true })
            }
        }
    }

    _selectReminder(reminderIndex) {
        let reminderSelected = this._reminders[reminderIndex];
        this.setState({
            reminderSelected
        }),
            this._setActivity('reminder', reminderSelected.value)
    }

    _selectOption(optionSelected) {
        if (optionSelected == 0) {
            this.setState({ optionSelected, optionLocationSelected: !this.state.optionLocationSelected });
        } else if (optionSelected == 1) {
            this.setState({ optionSelected, optionNoteSelected: !this.state.optionNoteSelected });
        } else if (optionSelected == 2) {
            this.setState({ optionSelected, isRepeatModalVisible: true });
        }
        this._pickerOption.hide();
    }

    _onCloseRepeatModal = () => this.setState({ isRepeatModalVisible: false });

    _selectRepeat(_repeat) {
        this._setActivity('notification_repeat', _repeat);
        this.setState({ isRepeatModalVisible: false });
    }

    _selectAddress(address) {
        this._setActivity("location", address.address);
        this.setState({ isSuggestLocation: false })
    }

    _setActivity = (key, value) => {
        let { activity } = this.state;
        activity[key] = value;
        this.setState({ activity });
    }

    _cancelCreateEvent() {
        this.props.navigation.goBack(null);
    }

    _backScreen() {
        const { goBack } = this.props.screenProps.navigation;
        goBack(null);
    }

    _registerReminder(_activity, _activityId, startDate) {
        let _reminder = _detectReminder(_activity.reminder, _handleDateObject(startDate));
        let _time = _reminder._time;
        let _sub = _reminder._reminder ? `in ${_reminder._reminder.time} ${_reminder._reminder.duration}` : '';
        let _repeat = _activity.notification_repeat != constants.none ? _detectRepeat(_activity.notification_repeat) : null;
        _createNotification(_activityId, _activity.name, _sub, _time, _repeat);
    }

    async _doCreateActivity() {
        let { activity, optionLocationSelected, optionNoteSelected } = this.state;
        if (!moment(activity.start_at).isBefore(moment(activity.end_at))) {
            return noticeUtils.inform(noticeUtils.message.startTimeGreaterThan)
        }
        this.setState({ isHandling: true });
        let timeOut = _timeoutCancelHandling(() => this.setState({ isHandling: false }));
        let userToken = this.props.user.apiKey;
        activity.child_id = this.state.childId;
        activity.start_at = moment(activity.start_at).format('DD-MM-YYYY HH:mm:ss');
        activity.end_at = moment(activity.end_at).format('DD-MM-YYYY HH:mm:ss');
        if (!optionLocationSelected) delete activity.location;
        if (!optionNoteSelected) delete activity.note;

        let response = await sf.getServices("CalendarService").createActivity(activity, userToken);
        this.setState({ isHandling: false });
        clearTimeout(timeOut);
        if (response && response.status == 200 && response.data && response.data.activity_info && !response.data.error) {
            noticeUtils.inform(noticeUtils.message.success);
            this._registerReminder(activity, response.data.activity_info.id, response.data.scheudle_info.start_at);

            this.props.navigation.state.params._onCreateEvent(activity, response.data);
            this.props.navigation.goBack(null);
        } else {
            if (response.status == 422) {
                let errKeys = Object.keys(response.data);
                let msgError = '';
                errKeys.forEach((err) => {
                    msgError += response.data[err][0] + ', ';
                })
                noticeUtils.inform(msgError);
            } else noticeUtils.inform(noticeUtils.message.errorServer)
        }
    }

    componentDidMount() {
        this.setState({
            activity: this.props.navigation.state.params.activity,
            childId: this.props.navigation.state.params.childId
        })
    }

    render() {
        const { isHandling, activity } = this.state;
        return (
            <TouchableWithoutFeedback onPress={this._handleOutside.bind(this)} accessible={false}>
                <KeyboardAvoidingView
                    style={styles.container}
                    behavior="padding"
                    enabled
                    keyboardVerticalOffset={150}
                >
                    <View style={styles.content}>
                        <View style={styles.viewHearCreate}>
                            <TouchableWithoutFeedback onPress={this._cancelCreateEvent.bind(this)}>
                                <Icon name='close'
                                    type='material-community'
                                    color={mainColor.defaultEvent}
                                    size={scale(22)} />
                            </TouchableWithoutFeedback>
                            <StandardText title>일정</StandardText>
                            <TouchableWithoutFeedback onPress={this._doCreateActivity.bind(this)}>
                                <Image
                                    source={require("../../assets/icons/checkedIcon.png")}
                                    style={styles.iconActionRight}
                                    resizeMode="contain" />
                            </TouchableWithoutFeedback>
                        </View>
                        <View style={styles.viewPickTime}>
                            <View>
                                {/* <ImageBackground style={panelStyles.viewDate}
                                            resizeMode="contain"
                                            source={typeSelectDate == 'start_at' ? require('../../assets/images/active_left.png') : require('../../assets/images/active_right.png')}>
                                            <TouchableWithoutFeedback onPress={this._selectDate.bind(this, 'start_at')}>
                                                <View style={[panelStyles.viewDateItem, typeSelectDate == 'start_at' ? panelStyles.viewDateActive : {}]}>
                                                    <StandardText bold>{activity.start_at ? moment(activity.start_at, 'DD-MM-YYYY').format('YYYY.MM.DD') : '날짜 시간 선택'}</StandardText>
                                                    {!!activity.start_at && <StandardText bold>{moment(activity.start_at, 'DD-MM-YYYY HH:ss').format('HH:ss')}</StandardText>}
                                                </View>
                                            </TouchableWithoutFeedback>
                                            <TouchableWithoutFeedback onPress={this._selectDate.bind(this, 'end_at')}>
                                                <View style={[panelStyles.viewDateItem, typeSelectDate == 'end_at' ? panelStyles.viewDateActive : {}]}>
                                                    <StandardText bold>{activity.end_at ? moment(activity.end_at, 'DD-MM-YYYY').format('YYYY.MM.DD') : '날짜 시간 선택'}</StandardText>
                                                    {!!activity.end_at && <StandardText bold>{moment(activity.end_at, 'DD-MM-YYYY HH:ss').format('HH:ss')}</StandardText>}
                                                </View>
                                            </TouchableWithoutFeedback>
                                        </ImageBackground> */}
                                <AdvanceInput
                                    title="일정 제목"
                                    rightIcon={require("../../assets/icons/addressInactive.png")}
                                    propComponent={{
                                        placeholder: '일정 제목',
                                        placeholderTextColor: mainColor.placeholder
                                    }}
                                    style={{
                                        borderColor: activity.name ? buttonColor.borderActive : mainColor.inputBorder,
                                        marginTop: scale(14)
                                    }}
                                    onChangeText={this._setActivity.bind(this, 'name')}
                                    focusStyle={{ borderColor: buttonColor.borderActive }}
                                />
                                <AdvanceInput
                                    title="에서"
                                    rightIcon={require("../../assets/icons/calendarInactive.png")}
                                    propComponent={{
                                        placeholder: '에서',
                                        placeholderTextColor: mainColor.placeholder
                                    }}
                                    value={activity.start_at}
                                    style={{
                                        borderColor: activity.location ? buttonColor.borderActive : mainColor.inputBorder,
                                        marginTop: scale(15)
                                    }}
                                    isDatePicker
                                    mode="datetime"
                                    onDateReturn={this._setDate.bind(this, 'start_at')}
                                    focusStyle={{ borderColor: buttonColor.borderActive }}
                                />

                                <AdvanceInput
                                    title="에"
                                    rightIcon={require("../../assets/icons/calendarInactive.png")}
                                    propComponent={{
                                        placeholder: '에',
                                        placeholderTextColor: mainColor.placeholder
                                    }}
                                    value={activity.end_at}
                                    style={{
                                        borderColor: activity.location ? buttonColor.borderActive : mainColor.inputBorder,
                                        marginTop: scale(15)
                                    }}
                                    isDatePicker
                                    mode="datetime"
                                    onDateReturn={this._setDate.bind(this, 'end_at')}
                                    focusStyle={{ borderColor: buttonColor.borderActive }}
                                />

                                {this.state.optionLocationSelected && <AdvanceInput
                                    title="장소"
                                    rightIcon={require("../../assets/icons/addressInactive.png")}
                                    propComponent={{
                                        placeholder: '장소',
                                        placeholderTextColor: mainColor.placeholder
                                    }}
                                    value={activity.location}
                                    style={{
                                        borderColor: activity.location ? buttonColor.borderActive : mainColor.inputBorder,
                                        marginTop: scale(15)
                                    }}
                                    onChangeText={this._searchAddress.bind(this)}
                                    focusStyle={{ borderColor: buttonColor.borderActive }}
                                />}
                                <SuggestComponent
                                    containerStyle={{ top: scale(115), left: '2%', right: '2%' }}
                                    visible={this.state.isSuggestLocation}
                                    data={this.state.locations}
                                    onSelect={this._selectAddress.bind(this)} />
                                {this.state.optionNoteSelected && <AdvanceInput
                                    title="메모"
                                    rightIcon={require("../../assets/icons/subjectInactive.png")}
                                    propComponent={{
                                        placeholder: '메모',
                                        placeholderTextColor: mainColor.placeholder
                                    }}
                                    style={{
                                        borderColor: activity.note ? buttonColor.borderActive : mainColor.inputBorder,
                                        marginTop: scale(15)
                                    }}
                                    onChangeText={this._setActivity.bind(this, 'note')}
                                    focusStyle={{ borderColor: buttonColor.borderActive }}
                                />}
                            </View>

                            <View style={styles.viewBottomCreate}>
                                <TouchableWithoutFeedback onPress={this._goPickReminder.bind(this)}>
                                    <View style={[styles.inRow, styles.alertSelect]}>
                                        <View style={styles.inRow}>
                                            <StandardText title>{this.state.reminderSelected.title}</StandardText>
                                        </View>
                                        <Icon name='chevron-right'
                                            type='material-community'
                                            color={mainColor.defaultEvent}
                                            size={scale(25)} />
                                    </View>
                                </TouchableWithoutFeedback>
                                <TouchableWithoutFeedback onPress={this._goPickMoreOption.bind(this)}>
                                    <View style={[styles.inRow, { marginTop: scale(15) }]}>
                                        <Image
                                            source={require("../../assets/icons/add.png")}
                                            style={styles.iconCreate}
                                            resizeMode="contain" />
                                        <StandardText style={{ marginLeft: scale(10) }}>항목 추가 (장소, 메모, 반복)</StandardText>
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                            <View style={{ position: 'absolute', bottom: scale(80) }}>
                                <ModalDropdown
                                    ref={ref => this._pickerReminder = ref}
                                    dropdownStyle={[styles.pickerReminderContainer, { height: scale(40 * 4) }]}
                                    options={this._reminders}
                                    renderRow={this._renderRowReminderPicker.bind(this)}
                                    renderButtonText={_renderButtonText.bind(this)}
                                    defaultValue=""
                                    onSelect={this._selectReminder.bind(this)}
                                />
                            </View>
                            <View style={{ position: 'absolute', bottom: scale(40) }}>
                                <ModalDropdown
                                    ref={ref => this._pickerOption = ref}
                                    dropdownStyle={[styles.pickerOptionContainer, { height: scale(49 * 3) }]}
                                    options={this._options}
                                    renderRow={this._renderRowOptionPicker.bind(this)}
                                    renderButtonText={_renderButtonText.bind(this)}
                                    defaultValue=""
                                    onSelect={this._selectOption.bind(this)}
                                />
                            </View>
                        </View>
                        <PopupRepeatEvent
                            isVisible={this.state.isRepeatModalVisible}
                            repeatSelected={activity.notification_repeat}
                            onClose={this._onCloseRepeatModal.bind(this)}
                            onAccept={this._selectRepeat.bind(this)} />
                    </View>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        )
    }

}

function bindAction(dispatch) {
    return {

    };
}

const mapStateToProps = state => ({
    user: state.user,
    location: state.location
});

export default connect(mapStateToProps, bindAction)(CreateEvent);