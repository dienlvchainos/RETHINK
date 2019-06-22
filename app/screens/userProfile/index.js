import React from 'react'
import { TouchableWithoutFeedback, View, Image, Keyboard } from 'react-native'
import BaseScreen from '../baseScreen';
import ImagePicker from 'react-native-image-crop-picker';
import ModalDropdown from 'react-native-modal-dropdown';
import Modal from 'react-native-modalbox';
import Header from "../../components/header";
import StandardText from '../../components/standardText';
import SimpleButton from '../../components/simpleButton';
import AdvanceInput from '../../components/advanceInput';
import language from '../../utils/languageUtils';
import moment from 'moment';
import { NavigationActions } from 'react-navigation'
import sf from '../../libs/serviceFactory';
import LoadingScreen from '../../components/loadingScreen';
import constant from "../../constants";
import styles from './styles';
import notice from '../../utils/noticeUtils';
import { connect } from 'react-redux';
import { Icon } from 'react-native-elements';
import { _getAvatarUser, _handleBirthday } from '../../helpers';
import { _actionSetUser } from '../../actions/userAction';
import { _actionSetChild, _actionSetChildList } from '../../actions/childAction';
import { _setStorage, _removeStore } from "../../utils/storeUtils";
import { scale } from '../../utils/scalingUtils';
import { buttonColor, mainColor } from '../../utils/styleUtils';
import { _customFacebookLogout, _customKakaoLogout } from './helpers';
import { _timeoutCancelHandling } from '../../helpers';
import constants from '../../constants';
import noticeUtils from '../../utils/noticeUtils';
import { _cancelLocalNotification } from '../overview/initEvent';
import AppConfig from '../../config';

class UserProfile extends BaseScreen {

    constructor(props) {
        super(props);
        this.state = {
            isHandling: false,
            user: props.user.data,
            avatar: null,
            isDeleteConfirm: false,
            passConfirmDelete: ''
        }
    }

    optionImagePicker = [
        {
            icon: require('../../assets/icons/cameraIcon.png'),
            title: '카메라'
        },
        {
            icon: require('../../assets/icons/pictureIcon.png'),
            title: '사진첩'
        }
    ];

    configImagePicker = {
        mediaType: 'photo'
    };

    _goChangeEmail() {
        if (this.props.user.data.account_type == constant.email) {
            this.navigate("changeEmail", { _onUpdateProfile: this._onUpdateProfile.bind(this) });
        } else notice.inform(notice.message.noSocialAvailable)
    }

    _onUpdateProfile = (_key, _data) => {
        let user = this.state.user;
        user[_key] = _data;
        this.setState({ user });
    }

    _goChangePassword() {
        if (this.props.user.data.account_type == constant.email) {
            this.navigate("changePassword");
        } else notice.inform(notice.message.noSocialAvailable)
    }

    _goKakao() {

    }

    async _doLogout() {
        this.setState({ isHandling: true });
        let timeOut = this._timeoutCancelHandling();
        const user = this.props.user.data;
        const userToken = this.props.user.apiKey;
        let _data = {
            email: user.email,
            account_type: user.account_type,
            api_key: userToken,
            social_account: user.social_account
        }
        let userRespon = await sf.getServices('UserService').logout(_data, userToken);
        this.setState({ isHandling: false, isDeleteConfirm: false });
        clearTimeout(timeOut);
        if (userRespon && userRespon.status == 200 && userRespon.data && !userRespon.data.error) {
            _removeStore(constant.userLogged);
            _removeStore(constant.repeatActivity);
            this.props._actionSetUser({}, '');
            this.props._actionSetChild({});
            this.props._actionSetChildList([]);
            _cancelLocalNotification();
            if (user.account_type != 'kakao') {
                _customKakaoLogout();
            } else if (user.account_type != 'facebook') {
                _customFacebookLogout();
            }

            const resetAction = NavigationActions.reset({
                index: 0,
                actions: [
                    NavigationActions.navigate({ routeName: 'gettingStarted' })
                ],
                key: null
            })
            this.props.navigation.dispatch(resetAction)
        } else {
            notice.inform(notice.message.errorServer);
        }
    }

    _goDeleteAccount() {
        this.setState({ isDeleteConfirm: true });
    }

    async _doDeleteAccount() {
        let passConfirmDelete = this.state.passConfirmDelete;
        const user = this.props.user.data;
        if (!passConfirmDelete && user.account_type == constants.email) return noticeUtils.inform(noticeUtils.message.passwordIncorrect);
        this.setState({ isHandling: true, isDeleteConfirm: false });
        let timeOut = _timeoutCancelHandling(() => this.setState({ isHandling: false }));
        const userToken = this.props.user.apiKey;
        let _data = {
            account_type: user.account_type,
            api_key: userToken
        }
        if (user.account_type == constants.email) {
            _data.email = user.email;
            _data.password = passConfirmDelete;
        } else {
            _data.social_account = user.social_account
        }

        let response = await sf.getServices('UserService').deleteUser(_data, userToken);
        this.setState({ isHandling: false });
        clearTimeout(timeOut);
        if (response && response.status == 200 && response.data && response.data.status != 'error') {
            this.props._actionSetUser({}, '');
            this.props._actionSetChild({});
            this.props._actionSetChildList([]);
            this.setState({
                isHandling: false
            });
            _cancelLocalNotification();
            if (user.account_type != 'kakao') {
                _customKakaoLogout();
            } else if (user.account_type != 'facebook') {
                _customFacebookLogout();
            }
            await _removeStore(constant.userLogged);
            await _removeStore(constant.repeatActivity);
            this.setState({
                isHandling: false
            });
            const resetAction = NavigationActions.reset({
                index: 0,
                actions: [
                    NavigationActions.navigate({ routeName: 'gettingStarted' })
                ],
                key: null
            })
            this.props.navigation.dispatch(resetAction)

        } else {
            notice.inform(notice.message.errorServer);
        }
    }

    _goChangeAvatar() {
        this._pickerImage.show();
    }

    _renderButtonText(rowData) {
        const { icon, title } = rowData;
        return ' ';
    }

    _renderRowPicker = (rowItem) => {
        return <TouchableWithoutFeedback key={rowItem.title} onPress={this._doPicker.bind(this, rowItem.type)}>
            <View style={styles.itemPicker}>
                <Image style={styles.iconPicker}
                    source={rowItem.icon}
                    resizeMode="contain" />
                <StandardText small>{rowItem.title}</StandardText>
            </View>
        </TouchableWithoutFeedback>
    }

    _doPicker(_type) {
        if (_type == 0) {
            ImagePicker.openCamera(AppConfig._configImagePicker()).then(image => {
                this.setState({ user: { ...this.state.user, avatar: image.path } });
                let avatar = {
                    uri: image.path,
                    type: image.mime,
                    data: image.data
                }
                this._doUpdateAvatar(avatar);
            });
        } else {
            ImagePicker.openPicker(AppConfig._configImagePicker()).then(image => {
                this.setState({ user: { ...this.state.user, avatar: image.path } });
                let avatar = {
                    uri: image.path,
                    type: image.mime,
                    data: image.data
                }
                this._doUpdateAvatar(avatar);
            });
        }
    }

    async _doUpdateAvatar(avatar) {
        this.setState({ isHandling: true });
        let timeOut = this._timeoutCancelHandling();
        const user = this.props.user.data;
        const userToken = this.props.user.apiKey;
        let _data = {
            api_key: userToken,
            account_type: user.account_type,
            social_account: user.social_account,
            email: user.email,
            avatar: {
                uri: avatar.uri,
                type: avatar.type,
                name: `${user.name}-avatar`,
                data: avatar.data
            }
        }
        let userRespon = await sf.getServices('UserService').updateProfile(_data, userToken);
        this.setState({ isHandling: false });
        clearTimeout(timeOut);
        if (userRespon && userRespon.status == 200 && userRespon.data && !userRespon.data.error) {
            this.props._actionSetUser(userRespon.data.user_info, userRespon.data.user_info.api_key);
            _setStorage(constant.userLogged, JSON.stringify(userRespon.data));

        } else {
            notice.inform(notice.message.errorServer);
        }
    }

    _timeoutCancelHandling() {
        let timeOut = setTimeout(() => this.setState({ isHandling: false }), 60000)
        return timeOut;
    }

    _goUpdateProfile() {
        this.navigate('updateProfileUser', { onBack: (userData) => this._onBackUpdate(userData) });
    }

    _goChangeAddress() {
        this.navigate('updateProfileUser', { isUpdateAddress: true, onBack: (userData) => this._onBackUpdate(userData) });
    }

    _onBackUpdate(userData) {
        this.setState({ user: userData.user_info });
    }

    _renderRelationship(relation) {
        switch (relation) {
            case constant.mother:
                return language.mother;
            case constant.father:
                return language.father;
            case constant.grandmother:
                return language.grandmother;
            case constant.grandfather:
                return language.grandfather;
            case constant.other:
                return language.other;
        }
    }

    _onCloseModalDelete = () => this.setState({ isDeleteConfirm: false });

    componentWillReceiveProps(nextProps) {

    }

    componentDidMount() {

    }

    render() {
        const { isHandling, user } = this.state;
        return (
            <View style={styles.container}>
                <Header screenProps={this.props}>편집</Header>
                <View style={styles.viewAvatar}>
                    <TouchableWithoutFeedback onPress={this._goChangeAvatar.bind(this)}>
                        <View style={{ flex: 1, justifyContent: 'center' }}>
                            {/* {!user.avatar && <TouchableWithoutFeedback onPress={this._goChangeAvatar.bind(this)}>
                                <View style={styles.viewButton}>
                                    <Image style={styles.btcChangeAvatar}
                                        source={require('../../assets/icons/buttonUpload.png')}
                                        resizeMode="contain" />
                                </View>
                            </TouchableWithoutFeedback>} */}
                            
                            {/* <Image style={[styles.avatar, { overflow: 'hidden' }]}
                                source={(typeof user.avatar == 'string') ? { uri: _getAvatarUser(user.avatar) } : user.avatar ? { uri: user.avatar.uri } : require('../../assets/images/user_image.png')}
                                resizeMode="cover" /> */}
                            <Image style={[styles.avatar, { overflow: 'hidden' }]}
                                source={(typeof user.avatar == 'string') ? { uri: _getAvatarUser(user.avatar) } : user.avatar ? { uri: user.avatar.uri } : require('../../assets/images/user_image.png')}
                                resizeMode="cover" />
                            <View style={{ position: 'absolute', height: scale(77) }}>
                                <ModalDropdown
                                    ref={ref => this._pickerImage = ref}
                                    dropdownStyle={styles.pickerContainer}
                                    options={this.optionImagePicker}
                                    renderRow={this._renderRowPicker}
                                    renderButtonText={(rowData) => this._renderButtonText(rowData)}
                                    defaultValue=""
                                    onSelect={this._doPicker.bind(this)}
                                />
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={this._goUpdateProfile.bind(this)}>
                        <View>
                            <StandardText style={{ textAlign: 'center' }}>
                                <StandardText title>{user.username ? user.username : language.noname}</StandardText>{user.relationship ? '(' + this._renderRelationship(user.relationship) + ')' : ''}
                            </StandardText>
                            <StandardText small style={{ textAlign: 'center' }}>
                                {user.birthday ? moment(_handleBirthday(user.birthday)).format('YYYY/MM/DD') : constant.unknow}
                            </StandardText>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
                <View style={styles.info}>
                    <View style={styles.item}>
                        <View style={styles.leftItem}>
                            <Image style={styles.itemIcon}
                                source={require('../../assets/icons/userIcon.png')}
                                resizeMode="cover" />
                            <StandardText style={{ marginLeft: scale(10) }}>이름</StandardText>
                        </View>
                        <StandardText>{user.username}</StandardText>
                    </View>
                    {user.account_type == constant.email &&
                        <TouchableWithoutFeedback onPress={this._goChangeEmail.bind(this)}>
                            <View style={styles.item}>
                                <View style={styles.leftItem}>
                                    <Image style={styles.itemIcon}
                                        source={require('../../assets/icons/mail.png')}
                                        resizeMode="contain" />
                                    <StandardText style={{ marginLeft: scale(10) }}>이메일 주소 변경</StandardText>
                                </View>
                                <View style={styles.leftItem}>
                                    <StandardText>{user.email}</StandardText>
                                    <Icon name='chevron-right'
                                        type='material-community'
                                        color='#E5EAF7'
                                        size={scale(20)} />
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    }
                    <TouchableWithoutFeedback onPress={this._goChangePassword.bind(this)}>
                        <View style={styles.item}>
                            <View style={styles.leftItem}>
                                <Image style={styles.itemIcon}
                                    source={require('../../assets/icons/lock.png')}
                                    resizeMode="contain" />
                                <StandardText style={{ marginLeft: scale(10) }}>비밀번호 변경</StandardText>
                            </View>
                            <View style={styles.leftItem}>
                                <StandardText>********</StandardText>
                                <Icon name='chevron-right'
                                    type='material-community'
                                    color='#E5EAF7'
                                    size={scale(20)} />
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={this._goChangeAddress.bind(this)}>
                        <View style={styles.item}>
                            <View style={styles.leftItem}>
                                <Image style={styles.itemIcon}
                                    source={require('../../assets/icons/homeIcon.png')}
                                    resizeMode="contain" />
                                <StandardText style={{ marginLeft: scale(10) }}>사는 지역</StandardText>
                            </View>
                            <View style={styles.leftItem}>
                                <StandardText>{user.address}</StandardText>
                                <Icon name='chevron-right'
                                    type='material-community'
                                    color='#E5EAF7'
                                    size={scale(20)} />
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                    {user.account_type != constants.email &&
                        <TouchableWithoutFeedback onPress={this._goKakao.bind(this)}>
                            <View style={styles.item}>
                                <View style={styles.leftItem}>
                                    <Image style={styles.itemIcon}
                                        source={user.account_type == constants.facebook ? require('../../assets/icons/fb.png') : require('../../assets/icons/kakao.png')}
                                        resizeMode="cover" />
                                    <StandardText style={{ marginLeft: scale(10) }}>{user.account_type == constants.facebook ? 'Facebook' : 'Kakao'}</StandardText>
                                </View>
                                <View style={styles.leftItem}>
                                    {(!!user.social_account && user.social_account != 'null') && <StandardText>{user.social_account}</StandardText>}
                                    <Icon name='chevron-right'
                                        type='material-community'
                                        color='#E5EAF7'
                                        size={scale(20)} />
                                </View>
                            </View>
                        </TouchableWithoutFeedback>}

                </View>
                <View style={styles.viewLogout}>
                    <TouchableWithoutFeedback onPress={this._doLogout.bind(this)}>
                        <View style={styles.leftItem}>
                            <Image style={styles.itemIcon}
                                source={require('../../assets/icons/logoutIcon.png')}
                                resizeMode="cover" />
                            <StandardText style={{ marginLeft: scale(10), color: '#FABC05' }}>로그아웃</StandardText>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={this._goDeleteAccount.bind(this)}>
                        <View style={styles.leftItem}>
                            <StandardText bold style={{ marginTop: scale(10) }}>탈퇴하고 계정 삭제</StandardText>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
                <Modal
                    isOpen={this.state.isDeleteConfirm}
                    backdropOpacity={0.5}
                    style={[styles.modalDelete]}
                    position="center"
                    ref={"modalDelete"}
                    swipeToClose={true}
                    onClosed={this._onCloseModalDelete.bind(this)}>
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                        <View style={{ flex: 1 }}>
                            <View style={styles.contentPopupDelete}>
                                <View style={styles.headerPopupDelete}>
                                    <StandardText large>이 계정을 삭제하시겠습니까?</StandardText>
                                </View>
                                <View style={styles.formPopupDelete}>
                                    {user.account_type == constants.email
                                        ? <AdvanceInput
                                            title="비밀번호"
                                            propComponent={{
                                                placeholder: '비밀번호',
                                                placeholderTextColor: mainColor.placeholder,
                                                secureTextEntry: true
                                            }}
                                            style={{
                                                borderColor: this.state.passConfirmDelete ? buttonColor.borderActive : mainColor.inputBorder
                                            }}
                                            onChangeText={(passConfirmDelete) => this.setState({ passConfirmDelete })}
                                            focusStyle={{ borderColor: buttonColor.borderActive }} />
                                        : <StandardText>이 계정을 삭제하시겠습니까?</StandardText>}
                                </View>

                            </View>
                            <View style={styles.contentAction}>
                                <SimpleButton
                                    onPress={this._doDeleteAccount.bind(this)}
                                    propComponent={{
                                        underlayColor: buttonColor.underlay
                                    }}
                                    style={styles.btnLeftModal}
                                    textStyle={{}}>복사</SimpleButton>
                                <SimpleButton
                                    onPress={() => this.setState({ isDeleteConfirm: false })}
                                    propComponent={{
                                        underlayColor: buttonColor.underlay
                                    }}
                                    style={styles.btnModal}
                                    textStyle={{}}>삭제</SimpleButton>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
                {isHandling && <LoadingScreen title="가공..." />}
            </View>
        )
    }

}

function bindAction(dispatch) {
    return {
        _actionSetUser: (userInfo, userToken) => dispatch(_actionSetUser(userInfo, userToken)),
        _actionSetChild: (_child) => dispatch(_actionSetChild(_child)),
        _actionSetChildList: (_list) => dispatch(_actionSetChildList(_list))
    };
}

const mapStateToProps = (state) => ({
    user: state.user
});

export default connect(mapStateToProps, bindAction)(UserProfile);