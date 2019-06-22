import React from 'react'
import { View, TouchableWithoutFeedback, Image, KeyboardAvoidingView, BackHandler, Keyboard } from 'react-native'
import { LoginManager, GraphRequest, AccessToken, GraphRequestManager } from 'react-native-fbsdk';
import RNKakaoLogins from 'react-native-kakao-logins';
import BaseScreen from '../baseScreen';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { scale } from '../../utils/scalingUtils';
import { buttonColor, mainColor, sizeStandard } from '../../utils/styleUtils';
import { validateEmail, invalidPassword } from '../../utils/validateUtils';
import noticeExceptions from '../../utils/noticeUtils';
import styles from './styles';
import sf from '../../libs/serviceFactory';
import { _actionSetUser, _actionSetTimetable } from '../../actions/userAction';
import { _setStorage } from "../../utils/storeUtils";
import constant from "../../constants";
import PopupPolicy from './popupPolicy/popupPolicy.js';
import PopupRelation from './popupRelation/popupRelation.js';
import Header from '../../components/header';
import CustomInput from '../../components/customInput';
import SimpleButton from '../../components/simpleButton';
import UnderlineText from '../../components/underlineText';
import LoadingScreen from '../../components/loadingScreen';
import SuggestComponent from '../../components/suggestComponent';

const checkedIcon = require("../../assets/icons/checkedIcon.png");
const closeIcon = require("../../assets/icons/closeIcon.png");

class Register extends BaseScreen {

    constructor(props) {
        super(props);
        this.state = {
            isHandling: false,
            email: null,
            password: null,
            repassword: null,
            address: null,
            popupPolicy: true,
            popupRelation: false,
            isSuggestLocation: false,
            locations: [],
            _marginTopButton: 60
        }
    }

    _registerStep1() {
        Keyboard.dismiss();
        let { email, password, repassword } = this.state;
        if (email && password) {
            if (password != repassword) return noticeExceptions.inform(noticeExceptions.message.passwordNotSame);
            if (!validateEmail(email)) return noticeExceptions.inform(noticeExceptions.message.emailInvalid);
            if (!invalidPassword(password)) return noticeExceptions.inform(noticeExceptions.message.passwordIncorrect);
            this.setState({ popupRelation: true });
        } else noticeExceptions.inform(noticeExceptions.message.invalidData);

    }

    _registerStep2 = (relationSelected) => {
        this.setState({ popupRelation: false, isHandling: true });
        this._registerStepSuccess(relationSelected);
    }

    async _registerStepSuccess(relationSelected) {
        let timeOut = this._timeoutCancelHandling();
        let { email, password, repassword, address } = this.state;
        let _data = {
            email,
            password,
            password_confirmation: repassword,
            address,
            relationship: relationSelected
        }
        let responRegister = await sf.getServices("AuthService").register(_data);
        this.setState({ isHandling: false });
        clearTimeout(timeOut);
        if (responRegister && responRegister.status == 200 && responRegister.data) {
            this.props._actionSetUser(responRegister.data.user_info, responRegister.data.user_info.api_key);
            this.props._actionSetTimetable(responRegister.data.timetable_setting);
            _setStorage(constant.userLogged, JSON.stringify(responRegister.data));
            setTimeout(() => {
                this._goOverview()
            }, 1000)
        } else {
            if (responRegister.data && responRegister.data.email) {
                return noticeExceptions.inform(responRegister.data.email[0])
            }
            return noticeExceptions.inform(noticeExceptions.message.registerFail)
        }
    }

    _goOverview() {
        const resetAction = NavigationActions.reset({
            key: null,
            actions: [
                NavigationActions.navigate({ routeName: 'overview', params: { isFristLogin: true } })
            ],
            index: 0
        });
        this.props.navigation.dispatch(resetAction);
    }

    _dismissModal() {
        this.setState({ popupRelation: false })
    }

    _timeoutCancelHandling() {
        let timeOut = setTimeout(() => this.setState({ isHandling: false }), 30000)
        return timeOut;
    }

    _doRegisterFb() {
        LoginManager.logOut((result) => { });
        const self = this;
        LoginManager.logInWithReadPermissions(['public_profile', 'email', 'user_gender', 'user_birthday']).then(
            function (result) {
                if (!result.isCancelled) {
                    AccessToken.getCurrentAccessToken().then(
                        (data) => {
                            let accessToken = data.accessToken;
                            const responseInfoCallback = (error, result) => {
                                if (!error) {
                                    self._successRegisterSocial(result, 'facebook');
                                }
                            }
                            const infoRequest = new GraphRequest('/me',
                                {
                                    accessToken: accessToken,
                                    parameters: {
                                        fields: {
                                            string: 'email,name,first_name,middle_name,last_name'
                                        }
                                    }
                                },
                                responseInfoCallback
                            );
                            new GraphRequestManager().addRequest(infoRequest).start();

                        }
                    )
                }
            },
            function (error) {
                noticeExceptions.inform(noticeExceptions.message.registerFail)
            }
        )
    }

    _doRegisterKakao() {
        const self = this;
        RNKakaoLogins.login((err, resultLogin) => {
            if (!err) {
                RNKakaoLogins.getProfile((err, resultProfile) => {
                    if (!err && resultProfile) {
                        self._successRegisterSocial(resultProfile, 'kakao')
                    } else noticeExceptions.inform(noticeExceptions.message.undefineError)
                });
            } else noticeExceptions.inform(noticeExceptions.message.undefineError)

        });
    }

    async _successRegisterSocial(result, type) {
        this.setState({ isHandling: true });
        let timeOut = this._timeoutCancelHandling();
        let _data = {
            account_type: type,
            username: type == 'facebook' ? result.name : result.nickname,
            avatar: type == 'facebook' ? "http://graph.facebook.com/" + result.id + "/picture?type=large" : '',
            social_id: result.id,
            social_account: result.email ? result.email : result.id
        }
        let responRegister = await sf.getServices("AuthService").socialLogin(_data);
        this.setState({ isHandling: false });
        clearTimeout(timeOut);
        if (responRegister && responRegister.status == 200 && responRegister.data) {
            if (
                responRegister.data.user_info &&
                responRegister.data.user_info.social_account &&
                // responRegister.data.user_info.birthday &&
                responRegister.data.user_info.address
            ) {
                this._onLoginSuccess(responRegister);
            } else {
                this.navigate('additionInfo', {
                    _data: responRegister.data.user_info,
                    onLoginAddition: this._onLoginSuccess.bind(this)
                });
            }
        } else {
            if (responRegister.data && responRegister.data.email) {
                return noticeExceptions.inform(responRegister.data.email[0])
            }
            return noticeExceptions.inform(noticeExceptions.message.registerFail)
        }
    }

    _onLoginSuccess = (responRegister) => {
        this.props._actionSetUser(responRegister.data.user_info, responRegister.data.user_info.api_key);
        if (responRegister.data.timetable_setting) this.props._actionSetTimetable(responRegister.data.timetable_setting);
        _setStorage(constant.userLogged, JSON.stringify(responRegister.data));
        this._goOverview();
    }

    async _searchAddress(_address) {
        this.setState({ address: _address })
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
                if (!this.state.isSuggestLocation) this.setState({ isSuggestLocation: true });
                this.setState({
                    offsetKeyboard: 500,
                    locations
                })
            }
        }
    }

    _selectAddress(location) {
        this.setState({
            address: location.address,
            isSuggestLocation: false
        })
    }

    _handleOutside() {
        let { isSuggestLocation } = this.state;
        if (isSuggestLocation) {
            this.setState({
                isSuggestLocation: false
            })
        }
        Keyboard.dismiss();
    }

    componentDidMount() {
        // BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid.bind(this));
    }

    render() {
        const { isHandling, popupPolicy, popupRelation, email, password, repassword, address } = this.state;
        return (
            <TouchableWithoutFeedback onPress={this._handleOutside.bind(this)} accessible={false}>
                <View style={styles.container}>
                    <KeyboardAvoidingView style={styles.form} behavior="padding" keyboardVerticalOffset={sizeStandard.offsetKeyboard50}>
                        <Header screenProps={this.props}>가입하기</Header>

                        <View style={{ flex: 5, justifyContent: 'center' }}>
                            <CustomInput
                                leftIcon={require('../../assets/icons/mail.png')}
                                propComponent={{
                                    placeholder: '이메일 주소',
                                    placeholderTextColor: mainColor.placeholder
                                }}
                                onFocus={() => this.setState({ _marginTopButton: 10 })}
                                onBlur={() => this.setState({ _marginTopButton: 60 })}
                                style={{
                                    borderColor: email ? buttonColor.borderActive : mainColor.inputBorder
                                }}
                                onChangeText={(_email) => this.setState({ email: _email })}
                                focusStyle={{ borderColor: buttonColor.borderActive }} />
                            <CustomInput
                                leftIcon={require('../../assets/icons/lock.png')}
                                rightIcon={password ? invalidPassword(password) ? checkedIcon : closeIcon : null}
                                propComponent={{
                                    placeholder: '8~32자리의 비밀번호',
                                    placeholderTextColor: mainColor.placeholder,
                                    secureTextEntry: true
                                }}
                                onFocus={() => this.setState({ _marginTopButton: 10 })}
                                onBlur={() => this.setState({ _marginTopButton: 60 })}
                                style={{
                                    marginTop: scale(15),
                                    borderColor: password ? buttonColor.borderActive : mainColor.inputBorder
                                }}
                                onChangeText={(password) => this.setState({ password })}
                                focusStyle={{ borderColor: buttonColor.borderActive }} />
                            <CustomInput
                                leftIcon={require('../../assets/icons/lock.png')}
                                rightIcon={repassword ? (invalidPassword(repassword) && password == repassword) ? checkedIcon : closeIcon : null}
                                propComponent={{
                                    placeholder: '8~32자리의 비밀번호',
                                    placeholderTextColor: mainColor.placeholder,
                                    secureTextEntry: true
                                }}
                                onFocus={() => this.setState({ _marginTopButton: 10 })}
                                onBlur={() => this.setState({ _marginTopButton: 60 })}
                                style={{
                                    marginTop: scale(15),
                                    borderColor: repassword ? buttonColor.borderActive : mainColor.inputBorder
                                }}
                                onChangeText={(repassword) => this.setState({ repassword })}
                                focusStyle={{ borderColor: buttonColor.borderActive }} />
                            <CustomInput
                                leftIcon={require('../../assets/icons/locationPoint.png')}
                                propComponent={{
                                    placeholder: '시/도/군/구 까지만 기입',
                                    placeholderTextColor: mainColor.placeholder,
                                    onSubmitEditing: () => this.setState({ isSuggestLocation: false }),
                                    value: address
                                }}
                                onFocus={() => this.setState({ _marginTopButton: 10 })}
                                onBlur={() => this.setState({ _marginTopButton: 60 })}
                                style={{
                                    marginTop: scale(15),
                                    borderColor: address ? buttonColor.borderActive : mainColor.inputBorder
                                }}
                                onChangeText={this._searchAddress.bind(this)}
                                focusStyle={{ borderColor: buttonColor.borderActive }} />
                            <View style={[styles.btn, { marginTop: scale(this.state._marginTopButton) }]}>
                                <SimpleButton
                                    onPress={this._registerStep1.bind(this)}
                                    propComponent={{
                                        underlayColor: buttonColor.underlay,
                                        disabled: (email && password && repassword && address) ? false : true
                                    }}
                                    style={(email && password && repassword && address) ? styles.btnActiveStyle : styles.btnInactiveStyle}
                                    textStyle={(email && password && repassword && address) ? styles.textActiveStyle : styles.textInactiveStyle}>
                                    가입하기
                                </SimpleButton>
                            </View>
                        </View>
                    </KeyboardAvoidingView>

                    <View style={styles.more}>
                        <View style={styles.title}>
                            <UnderlineText textStyle={styles.textSns}>SNS 계정으로 가입하기</UnderlineText>
                        </View>
                        <View style={styles.listIcon}>
                            <TouchableWithoutFeedback onPress={this._doRegisterKakao.bind(this)}>
                                <Image source={require('../../assets/icons/kakao.png')}
                                    resizeMode="cover"
                                    style={styles.icon} />
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={this._doRegisterFb.bind(this)}>
                                <Image source={require('../../assets/icons/fb.png')}
                                    resizeMode="cover"
                                    style={styles.icon} />
                            </TouchableWithoutFeedback>
                        </View>
                    </View>
                    <SuggestComponent
                        containerStyle={{ top: scale(250), left: '4%', right: '4%' }}
                        visible={this.state.isSuggestLocation}
                        data={this.state.locations}
                        onSelect={this._selectAddress.bind(this)} />
                    <PopupPolicy isVisible={popupPolicy} navigationProps={this.props.navigation} />
                    <PopupRelation isVisible={popupRelation} onRegister={this._registerStep2.bind(this)} onDismiss={this._dismissModal.bind(this)} />
                    {isHandling && <LoadingScreen title="가공..." />}
                </View>
            </TouchableWithoutFeedback>

        )
    }

    componentWillUnmount() {
        // BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid.bind(this));
    }

}

function bindAction(dispatch) {
    return {
        _actionSetUser: (userInfo, userToken) => dispatch(_actionSetUser(userInfo, userToken)),
        _actionSetTimetable: (timetable) => dispatch(_actionSetTimetable(timetable))
    };
}

const mapStateToProps = state => ({
    location: state.location
});

export default connect(mapStateToProps, bindAction)(Register);