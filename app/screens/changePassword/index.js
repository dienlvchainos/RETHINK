import React from 'react'
import { TouchableWithoutFeedback, View, Keyboard } from 'react-native'
import BaseScreen from '../baseScreen'
import { connect } from 'react-redux';
import styles from './styles';
import Header from "../../components/header";
import CustomInput from "../../components/customInput";
import SimpleButton from '../../components/simpleButton';
import { buttonColor, mainColor } from "../../utils/styleUtils";
import { scale } from '../../utils/scalingUtils';
import sf from '../../libs/serviceFactory';
import LoadingScreen from '../../components/loadingScreen';
import notice from "../../utils/noticeUtils";
import { invalidPassword } from '../../utils/validateUtils';

const checkedIcon = require("../../assets/icons/checkedIcon.png");
const closeIcon = require("../../assets/icons/closeIcon.png");

class ChangePassword extends BaseScreen {

    constructor(props) {
        super(props)
        this.state = {
            isHandling: false,
            isRightPassword: true,
            oldpassword: '',
            newpassword: '',
            repassword: ''
        }
    }

    _clearEmail = () => {
        this.setState({ email: '' })
    }

    async _doChangePassword() {
        const { oldpassword, newpassword, repassword } = this.state;
        if (invalidPassword(oldpassword) && invalidPassword(newpassword) && invalidPassword(repassword) && newpassword == repassword) {
            this.setState({ isHandling: true });
            let timeOut = this._timeoutCancelHandling();
            const user = this.props.user.data;
            const userToken = this.props.user.apiKey;
            let _data = {
                api_key: userToken,
                email: user.email,
                password: oldpassword,
                new_password: newpassword
            }
            let userRespon = await sf.getServices('UserService').changePassword(_data, userToken);
            this.setState({ isHandling: false });
            clearTimeout(timeOut);
            if (userRespon && userRespon.status == 200 && userRespon.data && userRespon.data.status == 'sucess') {
                this._resetForm();
                notice.inform(notice.message.passwordUpdated);
                this.props.navigation.goBack(null);
            } else {
                if (userRespon.data) {
                    this.setState({ isRightPassword: false });
                    return notice.inform(userRespon.data.message);
                }
                return notice.inform(notice.message.errorServer);;
            }
        } else notice.inform(notice.message.passwordNotSame);
    }

    _timeoutCancelHandling() {
        let timeOut = setTimeout(() => this.setState({ isHandling: false }), 60000)
        return timeOut;
    }

    _resetForm() {
        this.setState({ oldpassword: null, newpassword: null, repassword: null })
    }

    _setNewPassword = (newpassword) => {
        this.setState({ newpassword })
    }

    _setOldPassword = (oldpassword) => {
        this.setState({
            oldpassword,
            isRightPassword: true
        })
    }

    componentDidMount() {

    }

    render() {
        const { isHandling, oldpassword, newpassword, repassword, isRightPassword } = this.state;
        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <View style={styles.container}>
                    <Header screenProps={this.props}>이메일 주소 변경</Header>
                    <View style={styles.content}>
                        <View style={styles.form}>
                            <CustomInput
                                rightIcon={invalidPassword(oldpassword) ? isRightPassword ? checkedIcon : closeIcon : closeIcon}
                                propComponent={{
                                    placeholder: '기존 비밀번호',
                                    placeholderTextColor: mainColor.placeholder,
                                    secureTextEntry: true
                                }}
                                style={{
                                    borderColor: oldpassword ? buttonColor.borderActive : mainColor.inputBorder,
                                }}
                                onChangeText={this._setOldPassword.bind(this)}
                                focusStyle={{ borderColor: buttonColor.borderActive }} />

                            <CustomInput
                                rightIcon={(newpassword && invalidPassword(newpassword)) ? checkedIcon : closeIcon}
                                propComponent={{
                                    placeholder: '8~32자리의 비밀번호',
                                    placeholderTextColor: mainColor.placeholder,
                                    secureTextEntry: true
                                }}
                                style={{
                                    marginTop: scale(15),
                                    borderColor: newpassword ? buttonColor.borderActive : mainColor.inputBorder,
                                }}
                                onChangeText={this._setNewPassword.bind(this)}
                                focusStyle={{ borderColor: buttonColor.borderActive }} />
                            <CustomInput
                                rightIcon={(repassword && invalidPassword(repassword) && newpassword == repassword) ? checkedIcon : closeIcon}
                                propComponent={{
                                    placeholder: '8~32자리의 비밀번호',
                                    placeholderTextColor: mainColor.placeholder,
                                    secureTextEntry: true
                                }}
                                style={{
                                    marginTop: scale(15),
                                    borderColor: repassword ? buttonColor.borderActive : mainColor.inputBorder,
                                }}
                                onChangeText={(_repassword) => this.setState({ repassword: _repassword })}
                                focusStyle={{ borderColor: buttonColor.borderActive }} />
                        </View>
                        <View style={styles.viewButton}>
                            <SimpleButton
                                onPress={this._doChangePassword.bind(this)}
                                propComponent={{
                                    underlayColor: buttonColor.underlay
                                }}
                                containerStyle={{ marginTop: scale(64) }}
                                style={(oldpassword, newpassword, repassword) ? styles.btnActiveStyle : styles.btnInactiveStyle}
                                textStyle={(oldpassword, newpassword, repassword) ? styles.textActiveStyle : styles.textInactiveStyle}>확인</SimpleButton>
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

export default connect(mapStateToProps, bindAction)(ChangePassword);