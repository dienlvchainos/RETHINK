import React from 'react'
import { View, TouchableOpacity, Text, Image, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView } from 'react-native'
import { LoginManager, GraphRequest, AccessToken, GraphRequestManager } from 'react-native-fbsdk';
import { NavigationActions } from 'react-navigation';
import RNKakaoLogins from 'react-native-kakao-logins';
import BaseScreen from '../baseScreen';
import { connect } from 'react-redux';
import styles from './styles';
import { scale } from '../../utils/scalingUtils';
import { buttonColor, mainColor, sizeStandard } from '../../utils/styleUtils';
import noticeExceptions from '../../utils/noticeUtils';
import { _actionSetUser, _actionSetTimetable } from '../../actions/userAction';
import sf from '../../libs/serviceFactory';
import { _setStorage, _getStorage } from "../../utils/storeUtils";
import constant from "../../constants";

import Header from '../../components/header';
import CustomInput from '../../components/customInput';
import SimpleButton from '../../components/simpleButton';
import Separate from '../../components/separate';
import UnderlineText from '../../components/underlineText';
import Divide from '../../components/divide';
import LoadingScreen from '../../components/loadingScreen';
import constants from '../../constants';
import { _timeoutCancelHandling } from '../../helpers';

class Login extends BaseScreen {

    constructor(props) {
        super(props)
        this.state = {
            isHandling: false,
            email: null,
            password: null,
            // _marginTopButton: 
        }
    }

    _doLoginFb() {
        LoginManager.logOut((result) => { });
        const self = this;
        LoginManager.logInWithReadPermissions(['public_profile', 'email', 'user_gender']).then(
            function (result) {
                if (!result.isCancelled) {
                    AccessToken.getCurrentAccessToken().then(
                        (data) => {
                            let accessToken = data.accessToken;
                            const responseInfoCallback = async (error, result) => {
                                if (!error && result) {
                                    self._successLoginSocial(result, constants.facebook);
                                }
                            }
                            const infoRequest = new GraphRequest(
                                '/me',
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
                } else {

                }
            },
            function (error) {
                LoginManager.logOut((result) => {
                    if (result) this._doLoginFb();
                });
            }
        )
    }

    _doLoginKakao() {
        const self = this;
        RNKakaoLogins.login((err, resultLogin) => {
            if (!err) {
                RNKakaoLogins.getProfile((err, resultProfile) => {
                    if (!err && resultProfile) {
                        self._successLoginSocial(resultProfile, constants.kakao)
                    } else noticeExceptions.inform(noticeExceptions.message.undefineError)
                });
            } else noticeExceptions.inform(noticeExceptions.message.undefineError)

        });
    }

    async _doLoginEmail() {
        let { email, password } = this.state;
        if (email && password) {
            Keyboard.dismiss();
            this.setState({ isHandling: true });
            let timeOut = _timeoutCancelHandling(() => this.setState({ isHandling: false }));

            let responseLogin = await sf.getServices("AuthService").emailLogin({ email, password });
            this.setState({ isHandling: false });
            clearTimeout(timeOut);
            if (responseLogin && responseLogin.status == 200 && responseLogin.data) {
                this._onLoginSuccess(responseLogin);
            } else {
                this.setState({ isHandling: false });
                if (responseLogin.status == 422) {
                    noticeExceptions.inform(noticeExceptions.message.loginFail)
                } else noticeExceptions.inform(noticeExceptions.message.errorServer)
            }
        } else noticeExceptions.inform(noticeExceptions.message.loginDataWrong)
    }

    async _successLoginSocial(result, type) {
        this.setState({ isHandling: true });
        let timeOut = this._timeoutCancelHandling();
        let _data = {
            account_type: type,
            username: type == 'facebook' ? result.name : result.nickname,
            avatar: type == 'facebook' ? "http://graph.facebook.com/" + result.id + "/picture?type=large" : '',
            social_id: result.id,
            social_account: result.email ? result.email : result.id,
        }
        let responLogin = await sf.getServices("AuthService").socialLogin(_data);
        this.setState({ isHandling: false });
        clearTimeout(timeOut);
        if (responLogin && responLogin.status == 200 && responLogin.data) {
            if (
                responLogin.data.user_info &&
                responLogin.data.user_info.social_account &&
                // responLogin.data.user_info.birthday &&
                responLogin.data.user_info.address
            ) {
                this._onLoginSuccess(responLogin);
            } else {
                this.navigate('additionInfo', {
                    _data: responLogin.data.user_info,
                    onLoginAddition: this._onLoginSuccess.bind(this)
                });
            }
        } else noticeExceptions.inform(noticeExceptions.message.loginFail);
    }

    _onLoginSuccess = (responLogin) => {
        this.props._actionSetUser(responLogin.data.user_info, responLogin.data.user_info.api_key);
        if (responLogin.data.timetable_setting) this.props._actionSetTimetable(responLogin.data.timetable_setting);
        _setStorage(constant.userLogged, JSON.stringify(responLogin.data));
        const resetAction = NavigationActions.reset({
            key: null,
            actions: [
                NavigationActions.navigate({ routeName: 'overview', params: { isFristLogin: true } })
            ],
            index: 0
        });
        this.props.navigation.dispatch(resetAction);
    }

    _timeoutCancelHandling() {
        let timeOut = setTimeout(() => this.setState({ isHandling: false }), 60000)
        return timeOut;
    }

    _goRegister() {
        this.navigate('register');
    }

    async _goFindPassword() {
        this.navigate('resetPassword');
    }

    render() {
        let { email, password, isHandling } = this.state;
        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <View style={styles.container}>
                    <Header screenProps={this.props}>로그인</Header>
                    <KeyboardAvoidingView style={styles.form} behavior="padding" keyboardVerticalOffset={sizeStandard.offsetKeyboard50}>
                        <View style={{ flex: 5, justifyContent: 'flex-end' }}>
                            <CustomInput
                                leftIcon={require('../../assets/icons/mail.png')}
                                propComponent={{
                                    placeholder: '이메일 주소',
                                    placeholderTextColor: mainColor.placeholder,
                                    value: email
                                }}
                                style={{
                                    borderColor: email ? buttonColor.borderActive : mainColor.inputBorder
                                }}
                                onChangeText={(_email) => this.setState({ email: _email })}
                                focusStyle={{ borderColor: buttonColor.borderActive }} />
                            <CustomInput
                                leftIcon={require('../../assets/icons/lock.png')}
                                propComponent={{
                                    placeholder: '비밀번호',
                                    placeholderTextColor: mainColor.placeholder,
                                    secureTextEntry: true,
                                    value: password
                                }}
                                style={{
                                    marginTop: scale(20),
                                    borderColor: password ? buttonColor.borderActive : mainColor.inputBorder
                                }}
                                onChangeText={(password) => this.setState({ password })}
                                focusStyle={{ borderColor: buttonColor.borderActive }} />

                            <View style={{ alignItems: 'center', marginTop: scale(60), marginBottom: scale(10) }}>
                                <SimpleButton
                                    onPress={this._doLoginEmail.bind(this)}
                                    propComponent={{
                                        underlayColor: buttonColor.underlay
                                    }}
                                    style={(email && password) ? styles.btnActiveStyle : styles.btnInactiveStyle}
                                    textStyle={(email && password) ? styles.textActiveStyle : styles.textInactiveStyle}>
                                    확인
                                </SimpleButton>
                            </View>
                        </View>

                        {/* <View style={{ flex: 1, alignItems: 'center' }}> */}
                            {/* <SimpleButton
                                onPress={this._doLoginEmail.bind(this)}
                                propComponent={{
                                    underlayColor: buttonColor.underlay
                                }}
                                style={(email && password) ? styles.btnActiveStyle : styles.btnInactiveStyle}
                                textStyle={(email && password) ? styles.textActiveStyle : styles.textInactiveStyle}>
                                확인
                        </SimpleButton> */}
                        {/* </View> */}
                    </KeyboardAvoidingView>
                    <View style={styles.moreOption}>
                        <TouchableOpacity style={{ flex: 1 }} onPress={this._goRegister.bind(this)}>
                            <Text style={styles.txtMoreOption}>회원가입</Text>
                        </TouchableOpacity>
                        <Separate color={buttonColor.border} />
                        <TouchableOpacity style={{ flex: 1 }} onPress={this._goFindPassword.bind(this)}>
                            <Text style={styles.txtMoreOption}>비밀번호 찾기</Text>
                        </TouchableOpacity>
                    </View>

                    <Divide color={buttonColor.border} />
                    <View style={styles.more}>
                        <View style={styles.title}>
                            <UnderlineText textStyle={styles.textSns}>SNS 계정으로 가입하기</UnderlineText>
                        </View>
                        <View style={styles.listIcon}>
                            <TouchableWithoutFeedback onPress={this._doLoginKakao.bind(this)}>
                                <Image source={require('../../assets/icons/kakao.png')}
                                    resizeMode="cover"
                                    style={styles.icon} />
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={this._doLoginFb.bind(this)}>
                                <Image source={require('../../assets/icons/fb.png')}
                                    resizeMode="cover"
                                    style={styles.icon} />
                            </TouchableWithoutFeedback>
                        </View>
                    </View>
                    {isHandling && <LoadingScreen title="가공..." />}
                </View>
            </TouchableWithoutFeedback>
        )
    }
}

function bindAction(dispatch) {
    return {
        _actionSetUser: (userInfo, userToken) => dispatch(_actionSetUser(userInfo, userToken)),
        _actionSetTimetable: (timetable) => dispatch(_actionSetTimetable(timetable))
    };
}

const mapStateToProps = state => ({

});

export default connect(mapStateToProps, bindAction)(Login);