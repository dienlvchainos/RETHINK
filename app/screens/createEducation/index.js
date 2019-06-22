import React from 'react'
import { TouchableWithoutFeedback, SafeAreaView, View, Keyboard, KeyboardAvoidingView } from 'react-native'
import BaseScreen from '../baseScreen'
import { connect } from 'react-redux';
import styles from './styles';
import Header from "../../components/header";
import StandardText from '../../components/standardText';
import AdvanceInput from '../../components/advanceInput';
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

class CreateEducation extends BaseScreen {

    constructor(props) {
        super(props)
        this.state = {
            educations: [],
            organization: {
                name: '',
                subject: '',
                location: '',
                fee: 0,
                notification: 0
            },
            switchValue: false,
            buttonRect: {},
            isSuggestEducation: false,
            isSuggestLocation: false,
            locations: []
        }
    }

    _setOrganization = (key, value) => {
        let { organization } = this.state;
        if (key == 'fee') {
            let _value = value.split(',');
            let _arrVal = [].concat(..._value).join('');
            organization[key] = Number(_arrVal);
        } else organization[key] = value;
        this.setState({ organization });
    }

    async _onChangeName(_name) {
        this._setOrganization('name', _name);
        const userToken = this.props.user.apiKey;
        let eduRespon = await sf.getServices('EducationService').findByName(_name, userToken);
        if (eduRespon && eduRespon.status == 200 && eduRespon.data && !eduRespon.data.error) {
            if (eduRespon.data.length > 0) {
                this.setState({ educations: eduRespon.data, isSuggestEducation: true, isSuggestLocation: false });
            }
        } else {
            noticeUtils.inform(noticeUtils.message.errorServer);
        }
    }

    _onSwitchAlert = () => {
        if (this.state.switchValue) {
            this._setOrganization("notification", 0);
        } else this._setOrganization("notification", 1);
        this.setState({ switchValue: !this.state.switchValue });
    }

    _onValidOrganization() {
        let { organization } = this.state;
        let _invalid = true;
        let keys = Object.keys(organization);
        for (let i = 0; i < keys.length; i++) {
            if ((!organization[keys[i]] || organization[keys[i]] == '') && keys[i] != 'notification' && keys[i] != 'deleted_at') {
                _invalid = false;
            }
        }
        return _invalid;
    }

    async _doCreateEducation() {
        this.setState({ isHandling: true });
        let timeOut = this._timeoutCancelHandling();
        let _data = this.state.organization;
        _data.payment_date = moment(_data.payment_date, 'YYYY-MM-DD').format('DD-MM-YYYY');
        let userToken = this.props.user.apiKey;
        let response = await sf.getServices("EducationService").create(_data, userToken);
        this.setState({ isHandling: false });
        clearTimeout(timeOut);
        if (response && response.status == 200 && response.data && !response.data.error) {
            notice.inform(notice.message.success);
            this.props.navigation.state.params._updateListEducations(response.data.edu_info);
            this.props.navigation.goBack(null);
        } else {
            if (response.status == 422) {
                let errKeys = Object.keys(response.data);
                let msgError = '';
                errKeys.forEach((err) => {
                    msgError += response.data[err][0] + ', ';
                })
                notice.inform(msgError);
            } else notice.inform(notice.message.errorServer)
        }
    }

    _timeoutCancelHandling() {
        let timeOut = setTimeout(() => this.setState({ isHandling: false }), 60000)
        return timeOut;
    }

    async _focusOpenEducation() {

    }

    _handleOutside() {
        let { isSuggestLocation, isSuggestEducation } = this.state;
        if(isSuggestLocation) this.setState({ isSuggestLocation: false })
        if(isSuggestEducation) this.setState({ isSuggestLocation: false })
        Keyboard.dismiss();
    }

    _renderRowPicker = (item) => {
        return <TouchableWithoutFeedback onPress={() => this._selectEdu(item)}>
            <View style={styles.itemEducation}>
                <StandardText>{item.subject}</StandardText>
                <StandardText>{item.name}</StandardText>
                <StandardText>{item.location.substring(0, 8)}...</StandardText>
            </View>
        </TouchableWithoutFeedback>
    }

    _selectEdu(edu) {
        delete edu.subject;
        let switchValue = edu.notification == 1 ? true : false
        this.setState({
            organization: edu,
            isSuggestEducation: false,
            switchValue
        })
    }

    async _searchAddress(_address) {
        this._setOrganization("location", _address);
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
                if(!this.state.isSuggestLocation) this.setState({ isSuggestLocation: true });
                this.setState({ locations });
            }
        }
    }

    _selectAddress(address) {
        this._setOrganization("location", address.address);
        this.setState({
            isSuggestLocation: false
        })
    }

    componentDidMount() {

    }

    render() {
        const { isHandling, organization, switchValue } = this.state;
        return (
            <TouchableWithoutFeedback onPress={this._handleOutside.bind(this)} accessible={false}>
            <KeyboardAvoidingView style={{ flex: 1 }} keyboardVerticalOffset={0}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                    <View style={styles.container}>
                        <Header screenProps={this.props}>교육기관등록</Header>
                        <View style={styles.content}>
                            <View style={styles.form}>
                                <AdvanceInput
                                    ref={"inputName"}
                                    title="기관명"
                                    rightIcon={organization.name ? require('../../assets/icons/searchActive.png') : require('../../assets/icons/searchInactive.png')}
                                    propComponent={{
                                        placeholder: '기관명',
                                        placeholderTextColor: mainColor.placeholder,
                                        onSubmitEditing: () => this.setState({ isSuggestEducation: false })
                                    }}
                                    value={organization.name}
                                    style={{
                                        flex: 1,
                                        borderColor: organization.name ? buttonColor.borderActive : mainColor.inputBorder
                                    }}
                                    onChangeText={this._onChangeName.bind(this)}
                                    focusStyle={{ borderColor: buttonColor.borderActive }} />
                                <SuggestComponent
                                    containerStyle={{ top: scale(60), left: '2%', right: '2%' }}
                                    visible={this.state.isSuggestEducation}
                                    data={this.state.educations}
                                    onSelect={this._selectEdu.bind(this)} />
                                <AdvanceInput
                                    title="위치"
                                    propComponent={{
                                        placeholder: '위치',
                                        placeholderTextColor: mainColor.placeholder
                                    }}
                                    value={organization.location}
                                    style={{
                                        flex: 1,
                                        borderColor: organization.location ? buttonColor.borderActive : mainColor.inputBorder
                                    }}
                                    onChangeText={this._searchAddress.bind(this)}
                                    focusStyle={{ borderColor: buttonColor.borderActive }} />
                                <SuggestComponent
                                    containerStyle={{ top: scale(110), left: '2%', right: '2%' }}
                                    visible={this.state.isSuggestLocation}
                                    data={this.state.locations}
                                    onSelect={this._selectAddress.bind(this)} />
                                <AdvanceInput
                                    title="과목"
                                    propComponent={{
                                        placeholder: '과목',
                                        placeholderTextColor: mainColor.placeholder
                                    }}
                                    value={organization.subject}
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
                                        placeholderTextColor: mainColor.placeholder,
                                        keyboardType: 'numeric'
                                    }}
                                    value={_formatMoney(organization.fee).toString()}
                                    style={{
                                        flex: 1,
                                        borderColor: organization.fee ? buttonColor.borderActive : mainColor.inputBorder
                                    }}
                                    hintText="원"
                                    onChangeText={this._setOrganization.bind(this, "fee")}
                                    focusStyle={{ borderColor: buttonColor.borderActive }} />
                                <AdvanceInput
                                    title="납입일"
                                    rightIcon={require("../../assets/icons/pickDate.png")}
                                    propComponent={{
                                        placeholder: '납입일',
                                        placeholderTextColor: mainColor.placeholder,
                                        // editable: false
                                    }}
                                    style={{
                                        flex: 1,
                                        borderColor: organization.payment_date ? buttonColor.borderActive : mainColor.inputBorder
                                    }}
                                    isDatePicker
                                    onDateReturn={this._setOrganization.bind(this, "payment_date")}
                                    value={organization.payment_date}
                                    focusStyle={{ borderColor: buttonColor.borderActive }} />
                                <AdvanceInput
                                    title="납입일 (알람설정)"
                                    style={{
                                        flex: 1,
                                    }}
                                    onSwitch={this._onSwitchAlert.bind(this)}
                                    switchValue={switchValue} />
                            </View>
                            <View style={styles.btn}>
                                <SimpleButton
                                    onPress={this._doCreateEducation.bind(this)}
                                    propComponent={{
                                        underlayColor: buttonColor.underlay,
                                        disabled: !this._onValidOrganization()
                                    }}
                                    style={this._onValidOrganization() ? styles.btnActiveStyle : styles.btnInactiveStyle}
                                    textStyle={this._onValidOrganization() ? styles.textActiveStyle : styles.textInactiveStyle}>등록</SimpleButton>
                            </View>
                        </View>
                        {isHandling && <LoadingScreen title="가공..." />}
                    </View>
                </TouchableWithoutFeedback>
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

export default connect(mapStateToProps, bindAction)(CreateEducation);