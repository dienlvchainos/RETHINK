import React from 'react'
import { TouchableWithoutFeedback, View, Keyboard, BackHandler } from 'react-native'
import BaseScreen from '../baseScreen'
import { connect } from 'react-redux';
import styles from './styles';
import Header from "../../components/header";
import CustomInput from "../../components/customInput";
import StandardText from '../../components/standardText';
import SimpleButton from '../../components/simpleButton';
import { buttonColor, mainColor } from "../../utils/styleUtils";
import { scale } from '../../utils/scalingUtils';
import sf from '../../libs/serviceFactory';
import LoadingScreen from '../../components/loadingScreen';
import notice from "../../utils/noticeUtils";
import { validateEmail } from '../../utils/validateUtils';

class ResetPassword extends BaseScreen {

    constructor(props) {
        super(props)
        this.state = {
            isHandling: false,
            email: null
        }
    }

    _clearEmail = () => {
        this.setState({ email: '' })
    }

    async _doResetPassword() {
        const email = this.state.email;
        if (email) {
            if(!validateEmail(email)) return notice.inform(notice.message.emailInvalid);
            this.setState({ isHandling: true });
            let timeOut = this._timeoutCancelHandling();
            const userToken = this.props.user.apiKey;
            let _data = {
                email
            }
            let userRespon = await sf.getServices('UserService').resetPassword(_data, userToken);
            this.setState({ isHandling: false });
            clearTimeout(timeOut);
            if (userRespon && userRespon.status == 200 && userRespon.data && userRespon.data.status != 'error') {
                notice.inform(notice.message.successEmailResetPassword);
            } else {
                notice.inform(notice.message.errorServer);
            }
        } else notice.inform(notice.message.invalidData);
    }

    _timeoutCancelHandling() {
        let timeOut = setTimeout(() => this.setState({ isHandling: false }), 60000)
        return timeOut;
    }

    componentDidMount() {

    }

    render() {
        const { email, isHandling } = this.state;
        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <View style={styles.container}>
                    <Header screenProps={this.props}>비빌번호 변경</Header>
                    <View style={styles.content}>
                        <View style={styles.form}>
                            <CustomInput
                                propComponent={{
                                    placeholder: '이메일 주소',
                                    placeholderTextColor: mainColor.placeholder,
                                    value: email
                                }}
                                style={{
                                    borderColor: email ? buttonColor.borderActive : mainColor.inputBorder,
                                }}
                                onChangeText={(_email) => this.setState({ email: _email })}
                                focusStyle={{ borderColor: buttonColor.borderActive }}
                                onRightButton={this._clearEmail.bind(this)} />
                            <StandardText small style={{ marginTop: scale(20), width: '70%', textAlign: 'center' }}>위 이메일 주소로 비밀번호 재설정 URL을 전송합니다.</StandardText>
                        </View>
                        <View style={styles.viewButton}>
                            <SimpleButton
                                onPress={this._doResetPassword.bind(this)}
                                propComponent={{
                                    underlayColor: buttonColor.underlay,
                                    disabled: !email
                                }}
                                containerStyle={{ marginTop: scale(44) }}
                                style={email ? styles.btnActiveStyle : styles.btnInactiveStyle}
                                textStyle={email ? styles.textActiveStyle : styles.textInactiveStyle}>확인</SimpleButton>
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

    };
}

const mapStateToProps = state => ({
    user: state.user
});

export default connect(mapStateToProps, bindAction)(ResetPassword);