import React from 'react'
import { TouchableWithoutFeedback, ScrollView, Dimensions, View, FlatList, BackHandler, Image } from 'react-native'
import { connect } from 'react-redux';
import BaseScreen from '../baseScreen';
import Header from "./header"
import BottomMenu from "./bottomMenu"
import styles from './styles';
import sf from '../../libs/serviceFactory';
import notice from '../../utils/noticeUtils';
import { _getAvatarChild, _handleBirthday } from '../../helpers';
import { _actionSetChild, _actionSetChildList } from '../../actions/childAction';
import { _actionSetUser } from '../../actions/userAction';
import { _getStorage, _removeStore } from '../../utils/storeUtils';
import constants from '../../constants';
import LoadingScreen from '../../components/loadingScreen';
import StandardText from '../../components/standardText';
import ImageDisplay from '../../components/imageDisplay';
import languageUtils from '../../utils/languageUtils';
import moment from 'moment';
import { NavigationActions } from 'react-navigation';
import { scale } from '../../utils/scalingUtils';
import { mainColor } from '../../utils/styleUtils';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

class Overview extends BaseScreen {

    constructor(props) {
        super(props);
        this.state = {
            isHandling: true,
            childs: [],
            childImages: [],
            selectedChild: null,
            showImage: false,
            sourceImages: []
        }
    }

    async componentDidMount() {
        // this.navigate('education');
        // return;
        BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid.bind(this));

        let userLogged = await _getStorage(constants.userLogged);
        if (userLogged) {
            /**
             * User logged
             */
            const _user = JSON.parse(userLogged);
            this.props._actionSetUser(_user.user_info, _user.user_info.api_key);
            const userToken = _user.user_info.api_key;
            /**
             * Get list childs
             */
            let childRespon = await sf.getServices('ChildService').getList(userToken);
            if (childRespon.error) {
                return this._exceptionLogin();
            }
            if (childRespon && childRespon.status == 200 && childRespon.data && !childRespon.data.error) {
                this.setState({
                    childs: childRespon.data,
                    selectedChild: childRespon.data[0]
                });
                if (childRespon.data[0]) this.props._actionSetChild(childRespon.data[0]);
                this.props._actionSetChildList(childRespon.data);
                /**
                 * Get list image of all childs
                 */
                let childImageRespon = await sf.getServices('ChildService').getImages(userToken);
                if (childImageRespon && childImageRespon.data && childImageRespon.status == 200) {
                    let childImages = [];
                    for (let i = 0; i <= childImageRespon.data.length - 1; i++) {
                        childImages = childImages.concat(childImageRespon.data[i]);
                    }
                    this.setState({ childImages })
                }
            } else {
                if (childRespon.data.status == 401) {
                    return this._exceptionLogin();
                } else notice.inform(notice.message.errorServer);
            }
            this.setState({ isHandling: false });
        } else {
            this.setState({ isHandling: false });
            const resetAction = NavigationActions.reset({
                key: null,
                actions: [
                    NavigationActions.navigate({ routeName: 'gettingStarted' })
                ],
                index: 0
            });
            this.props.navigation.dispatch(resetAction);
            // this.navigate('gettingStarted');
        }
    }

    _exceptionLogin() {
        _removeStore(constants.userLogged);
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
        this.navigate('childs', { _onUpdateChild: this._onUpdateChild.bind(this) });
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
        this.setState({ childs, childImages })
    }

    _onUpdateChild(child, objAvatar) {
        let { childs, childImages } = this.state;
        let indexUpdated = childs.map((c) => c.id).indexOf(child.id);
        childs[indexUpdated] = child;
        let _childImage = childImages.find((c) => c.id == objAvatar.id);
        if (_childImage) {
            _childImage = Object.assign({}, { ...objAvatar });
        } else {
            childImages.push({ id: objAvatar.id, source: child.avatar });
        }
        this.setState({ childs, childImages })
    }

    onBackButtonPressAndroid() {
        return false;
        // const resetAction = NavigationActions.reset({
        //     index: 0,
        //     actions: [
        //         NavigationActions.navigate({ routeName: 'login' })
        //     ],
        //     key: 'gettingStarted'
        // })

        // this.props.navigation.dispatch(resetAction);
    };

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
                <StandardText large regular style={{color: mainColor.textInactive}}>아이를 추가하십시오 </StandardText>
                <StandardText large regular style={{color: mainColor.textInactive}}>add your child </StandardText>
            </View>
        </TouchableWithoutFeedback>
    )

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid.bind(this));
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
                    <ScrollView>
                        <FlatList
                            extraData={this.state}
                            data={childImages}
                            keyExtractor={(item, index) => String(item.id)}
                            renderItem={this._renderImage}
                            numColumns={Math.round((width - scale(17 * 2)) / scale(100))}
                            ListEmptyComponent={this._renderNoChild.bind(this)}
                        />
                    </ScrollView>
                </View>
                <ImageDisplay
                    isVisible={this.state.showImage}
                    sources={this.state.sourceImages}
                    onClose={() => this.setState({ showImage: false })}
                />
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
        _actionSetChildList: (_list) => dispatch(_actionSetChildList(_list))
    };
}

const mapStateToProps = state => ({
    user: state.user
});

export default connect(mapStateToProps, bindAction)(Overview);