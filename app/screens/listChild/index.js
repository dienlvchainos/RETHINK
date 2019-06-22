import React from 'react'
import { TouchableWithoutFeedback, View, FlatList, Image, BackHandler, ImageBackground, ScrollView, Alert } from 'react-native'
import BaseScreen from '../baseScreen'
import { connect } from 'react-redux';
import styles from './styles';
import { scale } from '../../utils/scalingUtils';
import Header from "../../components/header";
import StandardText from '../../components/standardText';
import UnderlineText from '../../components/underlineText';
import { Icon } from 'react-native-elements';
import sf from '../../libs/serviceFactory';
import notice from '../../utils/noticeUtils';
import constants from '../../constants';
import moment from 'moment';
import { _getAvatarChild, _handleBirthday } from '../../helpers';
import { _actionSetChild, _actionSetChildList, _actionVerifyDeletedChild } from '../../actions/childAction';
import languageUtils from '../../utils/languageUtils';

class ListChild extends BaseScreen {

    constructor(props) {
        super(props);
        this.state = {
            childs: [],
            favoriteChilds: [],
            childUpdated: null,
            childAvatarUpdated: null
        }
    }

    _renderGender(gender) {
        return gender == constants.boy ? languageUtils.boy : languageUtils.girl
    }

    _renderAge(birthday) {
        return moment().year() - moment(birthday).year();
    }

    _renderChilds = ({ item }) => (
        <TouchableWithoutFeedback
            onPress={this._goEditChild.bind(this, item)}
            onLongPress={this._goDeleteChild.bind(this, item)}
        >
            <ImageBackground
                style={styles.item}
                source={item.avatar ? { uri: _getAvatarChild(item.avatar) } : require("../../assets/images/child.jpg")}>
                <View style={styles.infoItem}>
                    <StandardText style={{ color: '#fff', textAlign: 'center' }}>{item.name}({this._renderGender(item.gender)}, 만 {this._renderAge(_handleBirthday(item.birthday))}세)</StandardText>
                    <StandardText style={{ color: '#fff' }} small>{'생일: ' + moment(_handleBirthday(item.birthday)).format('YYYY.MM.DD')}</StandardText>
                </View>
            </ImageBackground>
        </TouchableWithoutFeedback>
    )

    _goDeleteChild(child) {
        Alert.alert(
            '이 아이를 삭제하고 있습니다',
            '이 아이를 정말로 삭제 하시겠습니까?',
            [
                { text: '삭제', onPress: () => this._doDeleteChild(child.id) },
                {
                    text: '취소',
                    onPress: () => { },
                    style: 'cancel',
                }
            ],
            { cancelable: true },
        );
    }

    async _doDeleteChild(childId) {
        const userToken = this.props.user.apiKey;
        let childs = this.state.childs;
        let respon = await sf.getServices('ChildService').delete(childId, userToken);
        if (respon && respon.status == 200) {
            let _indexRemove = childs.map(c => c.id).indexOf(childId);
            childs.splice(_indexRemove, 1);
            this.setState({ childs });
            if (childId == this.props.child.selected.id) {
                this.props._actionSetChild(childs[0])
            }
            this.props._actionSetChildList(childs);
            this._childDeleted = childId;
        } else notice.inform(notice.message.errorWhenDelete);
    }

    _goEditChild(item) {
        this.navigate('editChild', {
            childId: item.id,
            _updateChildList: this._updateChildList.bind(this)
        });
    }

    _renderNewChild() {
        return <TouchableWithoutFeedback onPress={this._goNewChild.bind(this)}>
            <ImageBackground
                style={styles.item}
                source={require("../../assets/images/add_children.png")}>
                <TouchableWithoutFeedback onPress={this._goNewChild.bind(this)}>
                    <View style={styles.textCreate}>
                        <Icon name='plus-circle'
                            type='material-community'
                            color='#fff'
                            size={scale(20)} />
                        <StandardText style={{ marginLeft: scale(5), color: '#fff' }}>자녀 추가등록</StandardText>
                    </View>
                </TouchableWithoutFeedback>
            </ImageBackground>
        </TouchableWithoutFeedback>
    }

    _goNewChild() {
        this.navigate('newChild', { _updateChildList: this._updateChildList.bind(this) });
    }

    _updateChildList(child, type, avatarObject) {
        let { childs } = this.state;
        if (type == 1) { // type = 1 is edit a child
            childs = childs.map((c) => {
                let temp = Object.assign({}, c);
                if (temp.id == child.id) {
                    temp = child;
                }
                return temp
            })
        } else {
            // childs.push(child);
        }
        this.setState({
            childs,
            childUpdated: child,
            childAvatarUpdated: avatarObject
        })
    }

    _goBackOverview() {
        let { childUpdated, childAvatarUpdated } = this.state;
        if (childUpdated) this.props.navigation.state.params._onUpdateChild(childUpdated, childAvatarUpdated);
        if (this._childDeleted) {
            this.props.navigation.state.params._onUpdateChild(this._childDeleted);
            this._childDeleted = null;
        }
        this.props.navigation.goBack(null);
    }

    onBackButtonPressAndroid() {
        if (this._childDeleted) {
            this.props._actionVerifyDeletedChild(this._childDeleted);
        }
        return false;
    };

    async componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid.bind(this));
        this.setState({
            childs: this.props.child.list
        })
        // console.log("list-child", this.props.nav)
        // const userToken = this.props.user.apiKey;
        // let childRespon = await sf.getServices('ChildService').getList(userToken);
        // if (childRespon && childRespon.status == 200 && childRespon.data) {
        //     this.setState({ childs: childRespon.data })
        // } else {
        //     notice.inform(notice.message.errorServer);
        // }
    }

    render() {
        const childSelected = this.props.child.selected;
        return (
            <View style={styles.container}>
                <Header screenProps={this.props} onBack={this._goBackOverview.bind(this)}>자녀 홈</Header>
                {(childSelected && childSelected.name) &&
                    <TouchableWithoutFeedback onPress={this._goEditChild.bind(this, childSelected)}>
                        <View style={styles.gallery}>
                            <Image style={styles.iconChild}
                                source={childSelected.avatar ? { uri: _getAvatarChild(childSelected.avatar) } : require("../../assets/icons/noAvatar.png")}
                                resizeMode="cover" />
                            <StandardText style={{ marginLeft: scale(15), marginRight: scale(5) }}>{childSelected.name}</StandardText>
                            <Icon name='chevron-right'
                                type='material-community'
                                color='#000'
                                size={scale(20)} />
                        </View>
                    </TouchableWithoutFeedback>
                }
                <ScrollView>
                    <View style={styles.list}>
                        <View style={styles.headerList}>
                            <UnderlineText style={{}}><StandardText>자녀</StandardText></UnderlineText>
                        </View>
                        <FlatList
                            data={this.state.childs}
                            extraData={this.state}
                            horizontal
                            keyExtractor={(item, index) => String(index)}
                            renderItem={this._renderChilds}
                            ListFooterComponent={this._renderNewChild.bind(this)}
                        />
                    </View>
                    <View style={styles.list}>
                        <View style={styles.headerList}>
                            <UnderlineText style={{}}><StandardText>나의 관심글</StandardText></UnderlineText>
                        </View>
                        <FlatList
                            data={this.state.favoriteChilds}
                            extraData={this.state}
                            horizontal
                            keyExtractor={(item, index) => String(item.id)}
                            renderItem={this._renderChilds}
                        />
                    </View>
                </ScrollView>
            </View>
        )
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid.bind(this));
    }

}

function bindAction(dispatch) {
    return {
        _actionSetChild: (_child) => dispatch(_actionSetChild(_child)),
        _actionSetChildList: (_list) => dispatch(_actionSetChildList(_list)),
        _actionVerifyDeletedChild: (_childId) => dispatch(_actionVerifyDeletedChild(_childId))
    };
}

const mapStateToProps = state => ({
    user: state.user,
    child: state.child
});

export default connect(mapStateToProps, bindAction)(ListChild);