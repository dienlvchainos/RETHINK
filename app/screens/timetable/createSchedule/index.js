import React from 'react'
import { ScrollView, View, TouchableWithoutFeedback, Text, Image, FlatList } from 'react-native'
import Modal from 'react-native-modalbox';
import BaseScreen from '../baseScreen';
import StandardText from '../../components/standardText';
import styles from './styles';
import modalStyles from './modalStyles';
import { Fonts, sizeStandard } from '../../utils/styleUtils';
import sf from '../../libs/serviceFactory';
import { connect } from 'react-redux';
import moment from 'moment';
import { scale } from '../../utils/scalingUtils';
import { mainColor, buttonColor } from '../../utils/styleUtils';
import { Dimensions } from 'react-native';
import LoadingScreen from '../../components/loadingScreen';
import FloatButton from '../../components/floatButton';
import AdvanceInput from '../../components/advanceInput';
import SimpleButton from '../../components/simpleButton';
import Header from './header';
import noticeUtils from '../../utils/noticeUtils';
const width = Dimensions.get('window').width;
const EVENTS = require("./events.json");
const DayOfWeeks = require('./editTime/dayOfWeek.json');

class CreateSchedule extends BaseScreen {

    constructor(props) {
        super(props);
        this.state = {
            isHandling: false,
            isOpenModal: false,
            switchValue: false,
            organization: {
                name: '',
                subject: '',
                location: '',
                fee: 0,
                payment_date: '',
                notification: 0
            },
        }
    }

    _setOrganization = (key, value) => {
        let { organization } = this.state;
        if(key == 'fee') {
            let _value = value.split(',');
            let _arrVal = [].concat(..._value).join('');
            organization[key] = Number(_arrVal);
        } else organization[key] = value;
        this.setState({ organization });
    }

    _onValidOrganization() {
        let { organization } = this.state;
        let _invalid = true;
        let keys = Object.keys(organization);
        for (let i = 0; i < keys.length; i++) {
            if (!organization[keys[i]] || organization[keys[i]] == '') {
                _invalid = false;
            }
        }
        return _invalid;
    }

    _onSwitchAlert = () => {
        if (this.state.switchValue) {
            this._setOrganization("subject", 0);
        } else this._setOrganization("subject", 1);
        this.setState({ switchValue: !this.state.switchValue });
    }

    _doCreateTimetable() {

    }

    _timeoutCancelHandling() {
        let timeOut = setTimeout(() => this.setState({ isHandling: false }), 60000)
        return timeOut;
    }

    componentDidMount() {

    }

    render() {
        const { isHandling, isOpenModal, organization, switchValue } = this.state;
        const timeSelected = this.props.timeSelected;
        if (isHandling) {
            return <View style={styles.container}>
                <LoadingScreen />
            </View>
        }
        return (
            <View style={modalStyles.containderModal}>
                <View style={modalStyles.headerModal}>
                    <StandardText large>교육기관등록</StandardText>
                </View>
                <View style={modalStyles.contentModal}>
                    <View style={modalStyles.viewTimePicked}>
                        <StandardText bold>
                            {timeSelected.dayOfWeek && timeSelected.dayOfWeek.title} {timeSelected.startTime}~{timeSelected.endTime}
                        </StandardText>
                    </View>
                    <AdvanceInput
                        title="기관명"
                        rightIcon={organization.name ? require('../../assets/icons/searchActive.png') : require('../../assets/icons/searchInactive.png')}
                        propComponent={{
                            placeholder: '기관명',
                            placeholderTextColor: mainColor.placeholder
                        }}
                        style={{
                            flex: 1,
                            borderColor: organization.name ? buttonColor.borderActive : mainColor.inputBorder
                        }}
                        onFocus={this._focusOpenEducation.bind(this)}
                        onChangeText={this._setOrganization.bind(this, "name")}
                        focusStyle={{ borderColor: buttonColor.borderActive }} />
                    <AdvanceInput
                        title="위치"
                        rightIcon={organization.location ? require('../../assets/icons/addressActive.png') : require('../../assets/icons/addressInactive.png')}
                        propComponent={{
                            placeholder: '위치',
                            placeholderTextColor: mainColor.placeholder
                        }}
                        style={{
                            flex: 1,
                            borderColor: organization.location ? buttonColor.borderActive : mainColor.inputBorder
                        }}
                        onChangeText={this._setOrganization.bind(this, "location")}
                        focusStyle={{ borderColor: buttonColor.borderActive }} />
                    <AdvanceInput
                        title="과목"
                        rightIcon={organization.subject ? require('../../assets/icons/subjectActive.png') : require('../../assets/icons/subjectInactive.png')}
                        propComponent={{
                            placeholder: '과목',
                            placeholderTextColor: mainColor.placeholder
                        }}
                        style={{
                            flex: 1,
                            borderColor: organization.subject ? buttonColor.borderActive : mainColor.inputBorder
                        }}
                        onChangeText={this._setOrganization.bind(this, "subject")}
                        focusStyle={{ borderColor: buttonColor.borderActive }} />
                    <AdvanceInput
                        title="월 비용"
                        propComponent={{
                            placeholder: '월 비용',
                            placeholderTextColor: mainColor.placeholder
                        }}
                        style={{
                            flex: 1,
                            borderColor: organization.subject ? buttonColor.borderActive : mainColor.inputBorder
                        }}
                        onChangeText={this._setOrganization.bind(this, "fee")}
                        focusStyle={{ borderColor: buttonColor.borderActive }} />
                    <AdvanceInput
                        title="납입일"
                        rightIcon={organization.payment_date ? require('../../assets/icons/calendarActive.png') : require('../../assets/icons/calendarInactive.png')}
                        propComponent={{
                            placeholder: '납입일',
                            placeholderTextColor: mainColor.placeholder
                        }}
                        style={{
                            flex: 1,
                            borderColor: organization.payment_date ? buttonColor.borderActive : mainColor.inputBorder
                        }}
                        onChangeText={this._setOrganization.bind(this, "payment_date")}
                        focusStyle={{ borderColor: buttonColor.borderActive }} />
                    <AdvanceInput
                        title="납입일 (알람설정)"
                        style={{
                            flex: 1,
                        }}
                        onSwitch={this._onSwitchAlert.bind(this)}
                        switchValue={switchValue} />
                    <View style={modalStyles.btn}>
                        <SimpleButton
                            onPress={this._doCreateTimetable.bind(this)}
                            propComponent={{
                                underlayColor: buttonColor.underlay
                            }}
                            style={this._onValidOrganization() ? modalStyles.btnActiveStyle : modalStyles.btnInactiveStyle}
                            textStyle={this._onValidOrganization() ? modalStyles.textActiveStyle : modalStyles.textInactiveStyle}>등록</SimpleButton>
                    </View>
                </View>
            </View>
        )
    }

}

function bindAction(dispatch) {
    return {

    };
}

const mapStateToProps = state => ({
    user: state.user
});

export default connect(mapStateToProps, bindAction)(Timetable);