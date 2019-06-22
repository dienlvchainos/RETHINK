import React from 'react'
import { TouchableWithoutFeedback, View, Keyboard, Dimensions } from 'react-native'
import BaseScreen from '../baseScreen'
import Header from "../../components/header";
import { connect } from 'react-redux';
import styles from './styles';
import { mainColor, buttonColor } from '../../utils/styleUtils';
import { scale } from '../../utils/scalingUtils';
import AdvanceInput from '../../components/advanceInput';
import SimpleButton from '../../components/simpleButton';
import SuggestComponent from '../../components/suggestComponent';
import moment from 'moment';
import sf from '../../libs/serviceFactory';
import LoadingScreen from '../../components/loadingScreen';
import SimplePopup from '../../components/simplePopup';
import { _actionSetUser } from '../../actions/userAction';
import { _setStorage, _getStorage } from "../../utils/storeUtils";
import constant from "../../constants";
import notice from "../../utils/noticeUtils";
import { _handleBirthday, _timeoutCancelHandling } from '../../helpers';
import { _initLocation } from '../../utils/locationUtils';

class UpdateUserProfile extends BaseScreen {

    constructor(props) {
        super(props);
        this.state = {
            name: props.user.data.username,
            birthday: props.user.data.birthday ? moment(_handleBirthday(props.user.data.birthday)).format('YYYY-MM-DD') : null,
            address: props.user.data.address,
            isHandling: false,
            isNoticeLocationVisible: false,
            position: {
                latitude: null,
                longitude: null
            },
            isSuggestLocation: false,
            locations: []
        }
    }

    async _doUpdateProfile() {
        const { name, birthday, address } = this.state;
        this.setState({ isHandling: true });
        let timeOut = _timeoutCancelHandling(() => this.setState({ isHandling: false }));
        const user = this.props.user.data;
        const userToken = this.props.user.apiKey;
        let _data = {
            api_key: userToken,
            account_type: user.account_type,
            username: name,
            birthday: birthday ? moment(birthday).format('DD-MM-YYYY') : '',
            social_account: user.social_account,
            address
        }
        if (user.account_type == constant.email) _data.email = user.email;
        let userRespon = await sf.getServices('UserService').updateProfile(_data, userToken);
        this.setState({ isHandling: false });
        clearTimeout(timeOut);
        if (userRespon && userRespon.status == 200 && userRespon.data) {
            this.props._actionSetUser(userRespon.data.user_info, userRespon.data.user_info.api_key);
            _setStorage(constant.userLogged, JSON.stringify(userRespon.data));
            this.props.navigation.state.params.onBack(userRespon.data);
            this.props.navigation.goBack(null);
        } else {
            notice.inform(notice.message.errorServer);
        }
    }

    _handleOutside() {
        let { isSuggestLocation } = this.state;
        if (isSuggestLocation) {
            this.setState({ isSuggestLocation: false })
        }
        Keyboard.dismiss();
    }

    _onClose() {
        this.setState({ isUpdateSuccessVisible: false });
    }

    async _searchAddress(_address) {
        this.setState({ address: _address })
        let { position } = this.state;
        if (position.latitude && position.longitude) {
            let coordinate = `${position.longitude.toString()},${position.latitude.toString()}`;
            // let _coordinate = '127.1054328,37.3595963';
            let respon = await sf.getServices('UserService')._naverSearchAddress(_address, coordinate);
            if (respon && respon.data && respon.status == 200 && respon.data.status == 'OK') {
                let locations = respon.data.places.filter((p) => p.road_address != '').map((p) => {
                    return {
                        address: p.road_address
                    }
                })
                this.setState({
                    isSuggestLocation: true,
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

    componentWillReceiveProps(nextProps) {

    }

    async componentDidMount() {
        const { isUpdateAddress } = this.props.navigation.state.params;
        if (isUpdateAddress) {
            if (this.props.location.latitude) {
                this.setState({
                    position: {
                        latitude: this.props.location.latitude,
                        longitude: this.props.location.longitude
                    }
                })
            }
        }
    }

    render() {
        const { name, birthday, address, isHandling } = this.state;
        let birthdayProps = this.props.user.data.birthday;
        const { isUpdateAddress } = this.props.navigation.state.params;
        return (
            <TouchableWithoutFeedback onPress={this._handleOutside.bind(this)} accessible={false}>
                <View style={styles.container}>
                    <Header screenProps={this.props}>{isUpdateAddress ? '이메일 주소 변경' : '편집'}</Header>
                    <View style={styles.content}>
                        {!isUpdateAddress
                            ? <View style={styles.form}>
                                <AdvanceInput
                                    title="이름"
                                    propComponent={{
                                        placeholder: '이름',
                                        placeholderTextColor: mainColor.placeholder,
                                        disabled: (name && birthday)
                                    }}
                                    value={name}
                                    style={{
                                        borderColor: name ? buttonColor.borderActive : mainColor.inputBorder,
                                    }}
                                    onChangeText={(_name) => this.setState({ name: _name })}
                                    focusStyle={{ borderColor: buttonColor.borderActive }} />
                                <AdvanceInput
                                    title="생년월일"
                                    rightIcon={require("../../assets/icons/pickDate.png")}
                                    propComponent={{
                                        placeholder: '',
                                        placeholderTextColor: mainColor.placeholder,
                                        disabled: (name && birthday)
                                    }}
                                    value={birthday}
                                    style={{
                                        borderColor: birthday ? buttonColor.borderActive : mainColor.inputBorder, marginTop: scale(20)
                                    }}
                                    isDatePicker
                                    initDate={birthdayProps ? new Date(_handleBirthday(birthdayProps)) : new Date()}
                                    maximumDate={new Date()}
                                    onDateReturn={(_birthday) => this.setState({ birthday: _birthday })}
                                    focusStyle={{ borderColor: buttonColor.borderActive }} />
                            </View>
                            : <View style={styles.form}>
                                <AdvanceInput
                                    rightIcon={address ? require("../../assets/icons/searchActive.png") : require("../../assets/icons/searchInactive.png")}
                                    title="사는 지역"
                                    propComponent={{
                                        placeholder: '',
                                        placeholderTextColor: mainColor.placeholder,
                                        onSubmitEditing: () => this.setState({ isSuggestLocation: false })
                                    }}
                                    value={address}
                                    style={{
                                        borderColor: address ? buttonColor.borderActive : mainColor.inputBorder,
                                    }}
                                    initPosition={this.state.position}
                                    onChangeText={this._searchAddress.bind(this)}
                                    focusStyle={{ borderColor: buttonColor.borderActive }} />
                                <SuggestComponent
                                    containerStyle={{ top: scale(225), left: '2%', right: '2%' }}
                                    visible={this.state.isSuggestLocation}
                                    data={this.state.locations}
                                    onSelect={this._selectAddress.bind(this)} />

                            </View>
                        }
                        <View style={styles.btnView}>
                            <View style={styles.inform}>

                            </View>
                            <View style={styles.btn}>
                                <SimpleButton
                                    onPress={this._doUpdateProfile.bind(this)}
                                    propComponent={{
                                        underlayColor: buttonColor.underlay,
                                        disabled: isUpdateAddress ? address ? false : true : (name && birthday) ? false : true
                                    }}
                                    style={(isUpdateAddress && address) || (!isUpdateAddress && (name && birthday)) ? styles.btnActiveStyle : styles.btnInactiveStyle}
                                    textStyle={(isUpdateAddress && address) || (!isUpdateAddress && (name && birthday)) ? styles.textActiveStyle : styles.textInactiveStyle}>확인</SimpleButton>
                            </View>
                        </View>
                    </View>
                    <SimplePopup
                        isVisible={this.state.isNoticeLocationVisible}
                        text1="기기가 위치에 액세스하도록 허용해야합니다"
                        text2="Settings > Permission > Rethink"
                        onOk={() => { }}
                        onClose={this._onClose.bind(this)} />
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

const mapStateToProps = state => ({
    user: state.user,
    location: state.location
});

export default connect(mapStateToProps, bindAction)(UpdateUserProfile);