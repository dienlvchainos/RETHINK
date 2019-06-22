import React from 'react'
import { TouchableWithoutFeedback, View, Keyboard } from 'react-native'
import { NavigationActions } from 'react-navigation';
import styles from './styles';
import Header from "../../components/header";
import CustomInput from "../../components/customInput";
import SimpleButton from '../../components/simpleButton';
import { buttonColor, mainColor } from "../../utils/styleUtils";
import { scale } from '../../utils/scalingUtils';
import sf from '../../libs/serviceFactory';
import LoadingScreen from '../../components/loadingScreen';
import SimplePopup from '../../components/simplePopup';
import notice from "../../utils/noticeUtils";
import { invalidPassword } from '../../utils/validateUtils';
import { _timeoutCancelHandling } from '../../helpers';

const checkedIcon = require("../../assets/icons/checkedIcon.png");
const closeIcon = require("../../assets/icons/closeIcon.png");

class UpdatePassword extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            isHandling: false,
            isRightPassword: true,
            email: '',
            newpassword: '',
            repassword: '',
            isUpdateSuccessVisible: false
        }
    }

    _clearEmail = () => {
        this.setState({ email: '' })
    }

    async _doChangePassword() {
        const { newpassword, repassword } = this.state;
        if (invalidPassword(newpassword) && invalidPassword(repassword) && newpassword == repassword) {
            this.setState({ isHandling: true });
            let timeOut = _timeoutCancelHandling(() => this.setState({ isHandling: false }));
            let _data = {
                email: this.state.email,
                new_password: newpassword
            }
            let userRespon = await sf.getServices('UserService').updatePassword(_data);
            this.setState({ isHandling: false });
            clearTimeout(timeOut);
            if (userRespon && userRespon.status == 200 && userRespon.data && userRespon.data.status != 'error') {
                notice.inform(userRespon.data.message);
                this.setState({ isUpdateSuccessVisible: true });
            } else {
                if (userRespon.data) {
                    this.setState({ isRightPassword: false });
                    return notice.inform(userRespon.data.message);
                }
                return notice.inform(notice.message.errorServer);;
            }
        } else notice.inform(notice.message.passwordIncorrect);
    }

    _onSuccessResetPass() {
        const resetAction = NavigationActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({ routeName: 'gettingStarted' })
            ],
            key: null
        })
        this.props.navigation.dispatch(resetAction)
    }

    _onClose() {
        this.setState({ isUpdateSuccessVisible: false });
    }

    _setNewPassword(newpassword) {
        this.setState({ newpassword })
    }

    _setRePassword(repassword) {
        this.setState({ repassword })
    }

    componentDidMount() {
        this.setState({
            email: this.props.navigation.state.params.email
        })
    }

    render() {
        const { isHandling, newpassword, repassword, isRightPassword } = this.state;
        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <View style={styles.container}>
                    <Header screenProps={this.props}>이메일 주소 변경</Header>
                    <View style={styles.content}>
                        <View style={styles.form}>
                            <CustomInput
                                rightIcon={1 ? isRightPassword ? checkedIcon : closeIcon : closeIcon}
                                propComponent={{
                                    placeholder: '',
                                    placeholderTextColor: mainColor.placeholder,
                                    editable: false,
                                    value: this.state.email
                                }}
                                style={{
                                    borderColor: 1 ? buttonColor.borderActive : mainColor.inputBorder,
                                }}
                                focusStyle={{ borderColor: buttonColor.borderActive }} />

                            <CustomInput
                                rightIcon={newpassword ? invalidPassword(newpassword) ? checkedIcon : closeIcon : null}
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
                                rightIcon={repassword ? (invalidPassword(repassword) && newpassword == repassword) ? checkedIcon : closeIcon : null}
                                propComponent={{
                                    placeholder: '8~32자리의 비밀번호',
                                    placeholderTextColor: mainColor.placeholder,
                                    secureTextEntry: true
                                }}
                                style={{
                                    marginTop: scale(15),
                                    borderColor: repassword ? buttonColor.borderActive : mainColor.inputBorder,
                                }}
                                onChangeText={this._setRePassword.bind(this)}
                                focusStyle={{ borderColor: buttonColor.borderActive }} />
                        </View>
                        <View style={styles.viewButton}>
                            <SimpleButton
                                onPress={this._doChangePassword.bind(this)}
                                propComponent={{
                                    underlayColor: buttonColor.underlay
                                }}
                                containerStyle={{ marginTop: scale(64) }}
                                style={(newpassword, repassword) ? styles.btnActiveStyle : styles.btnInactiveStyle}
                                textStyle={(newpassword, repassword) ? styles.textActiveStyle : styles.textInactiveStyle}>확인</SimpleButton>
                        </View>
                    </View>
                    <SimplePopup
                        isVisible={this.state.isUpdateSuccessVisible}
                        text1="비밀번호가 변경되었습니다"
                        text2="사용하려면 다시 로그인하십시오"
                        onOk={this._onSuccessResetPass.bind(this)}
                        onClose={this._onClose.bind(this)} />
                    {isHandling && <LoadingScreen title="가공..." />}
                </View>
            </TouchableWithoutFeedback>
        )
    }

}

export default UpdatePassword;