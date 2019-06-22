import React from 'react'
import { TouchableWithoutFeedback, TouchableOpacity, View, Keyboard } from 'react-native'
import BaseScreen from '../baseScreen'
import { connect } from 'react-redux';
import styles from './styles';
import { scale } from '../../utils/scalingUtils';
import Header from "../../components/header";
import { mainColor, buttonColor, Fonts } from '../../utils/styleUtils';
import StandardText from '../../components/standardText';
import CustomInput from '../../components/customInput';
import SimpleButton from '../../components/simpleButton';
import UnderlineText from '../../components/underlineText';
import sf from '../../libs/serviceFactory';
import LoadingScreen from '../../components/loadingScreen';
import notice from "../../utils/noticeUtils";
import { validateEmail } from '../../utils/validateUtils';
import constants from '../../constants';
import { _setStorage } from "../../utils/storeUtils";
import { _actionSetUser } from '../../actions/userAction';

class ChangeEmail extends BaseScreen {

    constructor(props) {
        super(props);
        this.state = {
            isHandling: false,
            email: null,
            password: null,
            isExists: false
        }
    }

    _setEmail = (_email) => {
        this.setState({
            email: _email,
            isExists: false
        })
    }

    async _doChangeEmail() {
        const { email, password } = this.state;
        if (email && password) {
            if (!validateEmail(email)) return notice.inform(notice.message.emailInvalid);
            this.setState({ isHandling: true });
            let timeOut = this._timeoutCancelHandling();
            const user = this.props.user.data;
            const userToken = this.props.user.apiKey;
            let _data = {
                account_type: user.account_type,
                email: user.email,
                new_email: email,
                password
            }
            let userRespon = await sf.getServices('UserService').changeEmail(_data, userToken);
            this.setState({ isHandling: false });
            clearTimeout(timeOut);
            if (userRespon && userRespon.status == 200 && userRespon.data && userRespon.data.status != 'error') {
                this._resetForm();
                notice.inform(notice.message.success);
                this.props._actionSetUser(userRespon.data.user_info, userRespon.data.user_info.api_key);
                _setStorage(constants.userLogged, JSON.stringify(userRespon.data));
                this.props.navigation.state.params._onUpdateProfile(constants.email, email);
                this.props.navigation.goBack(null);
            } else {
                if (userRespon.data && userRespon.data.new_email) {
                    this.setState({ isExists: true });
                } else {
                    notice.inform(notice.message.passwordIncorrect);
                }
            }
        } else notice.inform(notice.message.errorServer);
    }

    _timeoutCancelHandling() {
        let timeOut = setTimeout(() => this.setState({ isHandling: false }), 60000)
        return timeOut;
    }

    _resetForm() {
        this.setState({ email: null, password: null })
    }

    _goFindPasswod() {
        this.navigate('resetPassword');
    }

    render() {
        const { isHandling, email, password, isExists } = this.state;
        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <View style={styles.container}>
                    <Header screenProps={this.props}>이메일 주소 변경</Header>
                    <View style={styles.content}>
                        <View style={styles.form}>
                            <CustomInput
                                propComponent={{
                                    placeholder: '이메일 주소',
                                    placeholderTextColor: mainColor.placeholder
                                }}
                                style={{
                                    borderColor: !!email ? buttonColor.borderActive : mainColor.inputBorder,
                                }}
                                onChangeText={this._setEmail.bind(this)}
                                focusStyle={{ borderColor: buttonColor.borderActive }} />
                            <CustomInput
                                propComponent={{
                                    placeholder: '비밀번호를 입력하고 본인 확인',
                                    placeholderTextColor: mainColor.placeholder,
                                    secureTextEntry: true
                                }}
                                style={{
                                    borderColor: password ? buttonColor.borderActive : mainColor.inputBorder, marginTop: scale(20)
                                }}
                                onChangeText={(_password) => this.setState({ password: _password })}
                                focusStyle={{ borderColor: buttonColor.borderActive }} />
                        </View>
                        <View style={styles.btnView}>
                            <View style={styles.inform}>
                                {!!isExists && <View style={styles.center}>
                                    <StandardText small style={{ color: '#FF0000', ...Fonts.NanumBarunGothic_Bold }}>{email}</StandardText>
                                    <StandardText small>현재 사용중인 이메일 주소입니다.</StandardText>
                                </View>}
                            </View>
                            <View style={styles.btn}>
                                <SimpleButton
                                    onPress={this._doChangeEmail.bind(this)}
                                    propComponent={{
                                        underlayColor: buttonColor.underlay,
                                        disabled: !(email && password)
                                    }}
                                    style={(email && password) ? styles.btnActiveStyle : styles.btnInactiveStyle}
                                    textStyle={(email && password) ? styles.textActiveStyle : styles.textInactiveStyle}>확인</SimpleButton>
                                <TouchableOpacity onPress={this._goFindPasswod.bind(this)}>
                                    <UnderlineText style={{ marginTop: scale(22), alignSelf: 'center' }}>
                                        <StandardText title>비밀번호 찾기</StandardText>
                                    </UnderlineText>
                                </TouchableOpacity>
                            </View>
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
        _actionSetUser: (userInfo, userToken) => dispatch(_actionSetUser(userInfo, userToken))
    };
}

const mapStateToProps = (state) => ({
    user: state.user
});

export default connect(mapStateToProps, bindAction)(ChangeEmail);