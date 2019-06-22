import React from 'react'
import { TouchableWithoutFeedback, Linking, Dimensions, View, BackHandler, Image } from 'react-native'
import { connect } from 'react-redux';
import BaseScreen from '../baseScreen';
import Header from "./header"
import BottomMenu from "./bottomMenu"
import styles from './styles';
import sf from '../../libs/serviceFactory';
import notice from '../../utils/noticeUtils';
import { _getAvatarChild, _handleBirthday, _timeoutCancelHandling } from '../../helpers';
import { _actionSetChild, _actionSetChildList } from '../../actions/childAction';
import { _actionSetLocation } from '../../actions/locationAction';
import { _actionSetUser } from '../../actions/userAction';
import { _getStorage, _removeStore } from '../../utils/storeUtils';
import constants from '../../constants';
import LoadingScreen from '../../components/loadingScreen';
import StandardText from '../../components/standardText';
import { _initEvent, _initSchedule, _cancelLocalNotification } from './initEvent';
import { _getQueryStringParameter } from '../../helpers';
import languageUtils from '../../utils/languageUtils';
import moment from 'moment';
import { NavigationActions } from 'react-navigation';
import { mainColor } from '../../utils/styleUtils';
import { _requestLocationPermission } from '../../utils/permissionUtils';
import { _initLocation } from '../../utils/locationUtils';
import { scale } from '../../utils/scalingUtils';

class Overview extends BaseScreen {

    constructor(props) {
        super(props);
        this.state = {
            isHandling: true,
            childs: [],
            childImages: [],
            selectedChild: {},
            showImage: false,
            sourceImages: [],
            _screen: 'overview',
            // _heightAvatar: '100%'
        }
        this._handleOpenURL = this._handleOpenURL.bind(this);
    }

    /**
     * Check open url linking 
     */
    async _handleOpenURL(event, currentUser, userToken) {
        if (event.url && event.url.indexOf('http://') != -1 && event.url.indexOf('timetable') != -1) {
            const urlParams = _getQueryStringParameter(event.url);
            const childParams = urlParams['c'];
            const permissionParams = urlParams['p'];
            const ownerParams = urlParams['o'];
            if (currentUser != ownerParams) {
                let _body = {
                    api_key: userToken,
                    child_ids: childParams.split('-').join(','),
                    type: permissionParams,
                    owner_id: Number(ownerParams)
                }
                let shareResponse = await sf.getServices("ChildService").sharePermission(_body, userToken);
                if (shareResponse && shareResponse.status == 200 && shareResponse.data && shareResponse.data.status != 'error') {
                    this.setState({ isHandling: false });
                    Linking.removeEventListener('url', this._handleOpenURL);
                    this.navigate('timetable', {
                        owner: ownerParams,
                        perms: permissionParams,
                        childPerms: childParams.split('-'),
                        timetableSetting: shareResponse.data.timetable_setting
                    });
                }
            }
        }
    }

    // deep-linking reset-password
    _handleUrlResetPassword(event) {
        return new Promise((resolve) => {
            if (event.url && event.url.indexOf('http://') != -1 && event.url.indexOf('reset-password') != -1) {
                const urlParams = _getQueryStringParameter(event.url);
                const emailParams = urlParams['email'];
                return resolve(emailParams);
            } else resolve();
        })
    }

    _initLinking(currentUser, userToken) {
        Linking
            .getInitialURL()
            .then(url => this._handleOpenURL({ url }, currentUser, userToken))
            .catch(console.error);
        Linking.addEventListener('url', this._handleOpenURL(currentUser, userToken));
    }

    _initLinkingPassword() {
        return new Promise((resolve) => {
            Linking
                .getInitialURL()
                .then(async (url) => {
                    let _isResetPassword = await this._handleUrlResetPassword({ url })
                    resolve(_isResetPassword);
                })
                .catch(() => resolve());
        });
    }

    async _setupLocation() {
        let permLocation = await _requestLocationPermission();
        if (!permLocation.error) {
            let _isLocation = await _initLocation();
            if (!_isLocation.error) {
                this.props._actionSetLocation(_isLocation)
            } else return notice.inform(_isLocation.error.message);
        }
    }

    async componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid.bind(this));
        this._setupLocation();
        let userLogged = await _getStorage(constants.userLogged);
        /**
        * User logged
        */
        if (userLogged) {
            let _timeOut = _timeoutCancelHandling(() => this.setState({ isHandling: false }));
            const _user = JSON.parse(userLogged);
            this.props._actionSetUser(_user.user_info, _user.user_info.api_key);
            const userToken = _user.user_info.api_key;
            this._initLinking(_user.user_info.id, userToken);
            /**
             * Get list childs
             */
            let childRespon = await sf.getServices('ChildService').getList(userToken);
            clearTimeout(_timeOut);
            this.setState({ isHandling: false });
            if (childRespon.error) {
                return this._exceptionLogin();
            }
            if (childRespon && childRespon.status == 200 && childRespon.data && !childRespon.data.error) {
                if (childRespon.data.length > 0) {
                    this.setState({
                        childs: childRespon.data,
                        selectedChild: childRespon.data[0] || {}
                    });
                    if (childRespon.data[0]) {
                        // this._onGetHeightAvatar(childRespon.data[0].avatar);
                        this.props._actionSetChild(childRespon.data[0])
                    };
                    this.props._actionSetChildList(childRespon.data);
                    if (this.props.navigation.state.params && this.props.navigation.state.params.isFristLogin) {
                        _initEvent(childRespon.data, userToken);
                        _initSchedule(childRespon.data, userToken);
                    }
                }
                /**
                 * Get list image of all childs
                 */
                // let childImageRespon = await sf.getServices('ChildService').getImages(userToken);
                // if (childImageRespon && childImageRespon.data && childImageRespon.status == 200) {
                //     let childImages = [];
                //     for (let i = 0; i <= childImageRespon.data.length - 1; i++) {
                //         childImages = childImages.concat(childImageRespon.data[i]);
                //     }
                //     this.setState({ childImages })
                // }
            } else {
                if (childRespon.data.status == 401) {
                    return this._exceptionLogin();
                }
            }
        } else {
            this.setState({ isHandling: false });
            let _isResetPassword = await this._initLinkingPassword();
            if (_isResetPassword) { // go to reset password
                const resetAction = NavigationActions.reset({
                    key: null,
                    actions: [
                        NavigationActions.navigate({ routeName: 'updatePassword', params: { email: _isResetPassword } })
                    ],
                    index: 0
                });
                this.props.navigation.dispatch(resetAction);
            } else {
                const resetAction = NavigationActions.reset({
                    key: null,
                    actions: [
                        NavigationActions.navigate({ routeName: 'gettingStarted' })
                    ],
                    index: 0
                });
                this.props.navigation.dispatch(resetAction);
            }
        }
    }

    _exceptionLogin() {
        _removeStore(constants.userLogged);
        _removeStore(constants.repeatActivity);
        this.props._actionSetUser({}, '');
        this.props._actionSetChild({});
        this.props._actionSetChildList([]);
        _cancelLocalNotification();
        const resetAction = NavigationActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({ routeName: 'gettingStarted' })
            ],
            key: null
        })
        this.props.navigation.dispatch(resetAction);
    }

    _selectChild = (child) => {
        this.setState({ selectedChild: child });
        this.props._actionSetChild(child);
        // this._onGetHeightAvatar(child.avatar);
        // this.navigate('childs', { _onUpdateChild: this._onUpdateChild.bind(this) });
    }

    _onGetHeightAvatar(_avatar) {
        if (_avatar) {
            _avatar = _getAvatarChild(_avatar);
            // Image.getSize(_avatar, (_size) => {
            //     if(_size) this.setState({ _heightAvatar: scale(_size) })
            // }, (error) => {
            //     this.setState({ _heightAvatar: '100%' })
            // })
        }
    }

    _goListChild() {
        this.navigate('childs', { _onUpdateChild: this._onUpdateChild.bind(this), _onRemoveChild: this._onRemoveChild.bind(this) });
    }

    _goNewChild() {
        this.navigate('newChild', { _updateChildList: this._updateChildList.bind(this) });
    }

    _updateChildList(child, type = 0, objAvatar) {
        let { childs, childImages } = this.state;
        if (objAvatar) childImages.push({ id: objAvatar.id, source: child.avatar })
        let _child = childs.find((c) => c.id == child.id);
        if (!_child) {
            childs.push(child);
        }
        this.setState({ childs, childImages, selectedChild: Object.assign({}, child) });
        // this._onGetHeightAvatar(child.avatar);
    }

    _onUpdateChild(child, objAvatar) {
        let { childs, childImages } = this.state;
        let indexUpdated = childs.map((c) => c.id).indexOf(child.id);
        childs[indexUpdated] = child;
        // let _childImage = childImages.find((c) => c.id == objAvatar.id);
        // if (_childImage) {
        //     _childImage = Object.assign({}, { ...objAvatar });
        // } else {
        //     childImages.push({ id: objAvatar.id, source: child.avatar });
        // }
        this.setState({ childs, childImages, selectedChild: { ...this.state.selectedChild, avatar: child.avatar } });
        // this._onGetHeightAvatar(child.avatar);
    }

    _onRemoveChild(childId) {
        let { childs } = this.state;
        let indexDeleted = childs.map((c) => c.id).indexOf(childId);
        childs.splice(indexDeleted, 1);
        this.setState({ childs })
    }

    onBackButtonPressAndroid() {
        // console.log("onBackButtonPressAndroid")
        // if (this.props.nav.root == constants.overview) {
        //     this._backClickCount == 1 ? BackHandler.exitApp() : this._spring();
        //     console.log("navigation", this.props.navigation)
        //     return true;
        // }
        return false;
    };

    _spring() {
        notice.inform(notice.message.backAndroidToExit);
        this._backClickCount = 1;
    }

    _renderGender(gender) {
        return gender == constants.boy ? languageUtils.boy : languageUtils.girl
    }

    _renderAge(birthday) {
        return moment().year() - moment(birthday).year();
    }

    _renderImage = ({ item }) => {
        return <TouchableWithoutFeedback onPress={this._viewImage.bind(this, item)}>
            <Image style={styles.imgItem}
                source={{ uri: _getAvatarChild(item.source) }}
                resizeMode="cover" />
        </TouchableWithoutFeedback>
    }

    _viewImage = (item) => {
        this.setState({
            sourceImages: [{ source: { uri: _getAvatarChild(item.source) } }],
            showImage: true
        });
    }

    _renderNoChild = () => (
        <TouchableWithoutFeedback onPress={this._goNewChild.bind(this)}>
            <View style={styles.viewNoChild}>
                <StandardText large regular style={{ color: mainColor.textInactive }}>아이를 추가하십시오 </StandardText>
                <StandardText large regular style={{ color: mainColor.textInactive }}>add your child </StandardText>
            </View>
        </TouchableWithoutFeedback>
    )

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid.bind(this));
        Linking.removeEventListener('url', this._handleOpenURL);
        this._backClickCount = null;
        // console.log("_screen", this.state._screen);
        // this.setState({ _screen: null })
    }

    componentWillReceiveProps(nextProps) {

    }

    // shouldComponentUpdate(nextProps, nextState) {
    //     if (nextState.childImages.length != this.state.childImages.length ||
    //         nextState.childs.length != this.state.childs.length ||
    //         nextState.isHandling != this.state.isHandling ||
    //         nextState.showImage != this.state.showImage
    //     ) {
    //         return true;
    //     }
    //     return false;
    // }

    render() {
        const { childs, childImages, selectedChild } = this.state;
        const { isHandling } = this.state;
        if (isHandling) {
            return <View style={styles.container}>
                <LoadingScreen />
            </View>
        }
        return (
            <View style={styles.container}>
                <Header screenProps={this.props}
                    childs={childs}
                    onGoNewChild={this._goNewChild.bind(this)}
                    onSelectChild={this._selectChild.bind(this)} />
                <View style={styles.content}>
                    {childs.length == 0
                        ? <TouchableWithoutFeedback onPress={this._goNewChild.bind(this)}>
                            <View style={styles.viewNoChild}>
                                <StandardText large regular style={{ color: mainColor.textInactive }}>아이를 추가하십시오 </StandardText>
                                <StandardText large regular style={{ color: mainColor.textInactive }}>add your child </StandardText>
                            </View>
                        </TouchableWithoutFeedback>
                        : <TouchableWithoutFeedback onPress={this._goListChild.bind(this)}>
                            <View style={styles.img}>
                                {selectedChild.avatar
                                    ? <Image
                                        style={[styles.image, { height: scale(450) }]}
                                        source={(selectedChild && selectedChild.avatar) ? { uri: _getAvatarChild(selectedChild.avatar) } : require('../../assets/images/child.jpg')}
                                        resizeMode="cover" />
                                    : <Image
                                        style={styles.image}
                                        source={require('../../assets/images/child.jpg')}
                                        resizeMode="cover" />
                                }
                            </View>
                        </TouchableWithoutFeedback>
                    }
                </View>
                <View style={styles.bottomMenu}>
                    <BottomMenu navigationProps={this.props.navigation} />
                </View>
            </View>
        )
    }

}

function bindAction(dispatch) {
    return {
        _actionSetUser: (userInfo, userToken) => dispatch(_actionSetUser(userInfo, userToken)),
        _actionSetChild: (_child) => dispatch(_actionSetChild(_child)),
        _actionSetChildList: (_list) => dispatch(_actionSetChildList(_list)),
        _actionSetLocation: (_location) => dispatch(_actionSetLocation(_location))
    };
}

const mapStateToProps = state => ({
    user: state.user,
    nav: state.nav
});

export default connect(mapStateToProps, bindAction)(Overview);