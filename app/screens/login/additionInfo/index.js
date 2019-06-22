import React from 'react'
import { TouchableWithoutFeedback, View, Keyboard } from 'react-native'
import BaseScreen from '../../baseScreen'
import Header from "../../../components/header";
import { connect } from 'react-redux';
import styles from './styles';
import { mainColor, buttonColor, Fonts } from '../../../utils/styleUtils';
import { scale } from '../../../utils/scalingUtils';
import AdvanceInput from '../../../components/advanceInput';
import SimpleButton from '../../../components/simpleButton';
import SuggestComponent from '../../../components/suggestComponent';
import moment from 'moment';
import sf from '../../../libs/serviceFactory';
import LoadingScreen from '../../../components/loadingScreen';
import notice from "../../../utils/noticeUtils";
import { _handleBirthday, _timeoutCancelHandling } from '../../../helpers';

class AdditionInfo extends BaseScreen {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            birthday: moment().format('YYYY-MM-DD'),
            address: '',
            isHandling: false,
            isSuggestLocation: false,
            locations: []
        }
    }

    async _doSuccessAddition() {
        Keyboard.dismiss();
        const { email, address, birthday } = this.state;
        if (address) {
            this.setState({ isHandling: true });
            let timeOut = _timeoutCancelHandling(() => this.setState({ isHandling: false }));
            const _data = this.props.navigation.state.params._data;;
            const userToken = _data.api_key;
            let dataAddition = {
                api_key: userToken,
                account_type: _data.account_type,
                username: _data.username,
                // birthday: moment(this.state.birthday).format('DD-MM-YYYY'),
                social_account: email,
                address
            }
            let userRespon = await sf.getServices('UserService').updateProfile(dataAddition, userToken);
            this.setState({ isHandling: false });
            clearTimeout(timeOut);
            if (userRespon && userRespon.status == 200 && userRespon.data && userRespon.data.status == 'success') {
                this.props.navigation.state.params.onLoginAddition(userRespon);
            } else {
                notice.inform(notice.message.errorServer);
            }
        }
    }

    async _searchAddress(_address) {
       this.setState({ address: _address });
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
                this.setState({ locations });
            }
        }
    }

    _selectAddress(address) {
        this.setState({ address: address.address });
        this.setState({
            isSuggestLocation: false
        })
    }

    _handleOutside() {
        let { isSuggestLocation } = this.state;
        if (isSuggestLocation) this.setState({ isSuggestLocation: false })
        Keyboard.dismiss();
    }

    componentDidMount() {
        let _data = this.props.navigation.state.params._data;
        this.setState({
            email: _data.social_account,
            birthday: _data.birthday ? _handleBirthday(_data.birthday) : '',
            address: _data.address
        })
    }

    render() {
        const { email, address, birthday, isHandling } = this.state;
        return (
            <TouchableWithoutFeedback onPress={this._handleOutside.bind(this)} accessible={false}>
                <View style={styles.container}>
                    <Header screenProps={this.props}>추가 정보 입력</Header>
                    <View style={styles.content}>
                        <View style={styles.form}>
                            {!email && <AdvanceInput
                                title="이메일 주소"
                                rightIcon={require("../../../assets/icons/mail.png")}
                                propComponent={{
                                    placeholder: '이메일 주소',
                                    placeholderTextColor: mainColor.placeholder
                                }}
                                value={email}
                                style={{
                                    borderColor: email ? buttonColor.borderActive : mainColor.inputBorder,
                                }}
                                isDot={false}
                                onChangeText={(_email) => this.setState({ email: _email })}
                                focusStyle={{ borderColor: buttonColor.borderActive }} />}
                            {/* <AdvanceInput
                                title="생년월일"
                                rightIcon={require("../../../assets/icons/pickDate.png")}
                                propComponent={{
                                    placeholder: '',
                                    placeholderTextColor: mainColor.placeholder
                                }}
                                value={birthday}
                                style={{
                                    borderColor: birthday ? buttonColor.borderActive : mainColor.inputBorder, marginTop: scale(20)
                                }}
                                isDot={false}
                                isDatePicker
                                onDateReturn={(_birthday) => this.setState({ birthday: _birthday })}
                                focusStyle={{ borderColor: buttonColor.borderActive }} /> */}
                            <AdvanceInput
                                title="사는 지역"
                                rightIcon={address ? require("../../../assets/icons/searchActive.png") : require("../../../assets/icons/searchInactive.png")}
                                propComponent={{
                                    placeholder: '',
                                    placeholderTextColor: mainColor.placeholder
                                }}
                                value={address}
                                style={{
                                    borderColor: address ? buttonColor.borderActive : mainColor.inputBorder, marginTop: scale(20)
                                }}
                                isDot={false}
                                onChangeText={this._searchAddress.bind(this)}
                                focusStyle={{ borderColor: buttonColor.borderActive }} />
                            <SuggestComponent
                                containerStyle={{ top: scale(150), left: '2%', right: '2%' }}
                                visible={this.state.isSuggestLocation}
                                data={this.state.locations}
                                onSelect={this._selectAddress.bind(this)} />
                        </View>
                        <View style={styles.btnView}>
                            <View style={styles.btn}>
                                <SimpleButton
                                    onPress={this._doSuccessAddition.bind(this)}
                                    propComponent={{
                                        underlayColor: buttonColor.underlay
                                    }}
                                    style={(address) ? styles.btnActiveStyle : styles.btnInactiveStyle}
                                    textStyle={(address) ? styles.textActiveStyle : styles.textInactiveStyle}>확인</SimpleButton>
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

    };
}

const mapStateToProps = state => ({
    location: state.location
});

export default connect(mapStateToProps, bindAction)(AdditionInfo);