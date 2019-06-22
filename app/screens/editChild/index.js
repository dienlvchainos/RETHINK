import React from 'react'
import { TouchableWithoutFeedback, View, Keyboard, ImageBackground, Image } from 'react-native'
import BaseScreen from '../baseScreen'
import { connect } from 'react-redux';
import ModalDropdown from 'react-native-modal-dropdown';
import ImagePicker from 'react-native-image-crop-picker';
import Header from "../../components/header";
import styles from './styles';
import { mainColor, buttonColor, Fonts } from '../../utils/styleUtils';
import { scale } from '../../utils/scalingUtils';
import sf from '../../libs/serviceFactory';
import moment from 'moment';
import notice from '../../utils/noticeUtils';
import StandardText from '../../components/standardText';
import AdvanceInput from '../../components/advanceInput';
import SimpleButton from '../../components/simpleButton';
import CustomRadioGroup from '../../components/customRadioGroup';
import LoadingScreen from '../../components/loadingScreen';
import { _getAvatarChild, _handleBirthday } from '../../helpers';
import { _actionSetChild, _actionSetChildList } from '../../actions/childAction';
import languageUtils from '../../utils/languageUtils';
import constants from '../../constants';
import AppConfig from '../../config';

class EditChild extends BaseScreen {

    constructor(props) {
        super(props);
        this.state = {
            childId: null,
            name: null,
            birthday: null,
            genderSelected: null,
            colorSelected: '#000',
            avatar: null,
            isHandling: false
        }
    }

    onBackButtonPressAndroid = () => {
        this.props.navigation.navigate('login');
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
    ]

    relationOptions = [
        { label: languageUtils.boy, id: 0, value: constants.boy, selected: false },
        { label: languageUtils.girl, id: 1, value: constants.girl, selected: false }
    ]

    _goChangeAvatar() {
        this._pickerImage.show();
    }

    _renderButtonText(rowData) {
        const { icon, title } = rowData;
        return ' ';
    }

    _renderRowPicker = (rowItem) => {
        return <TouchableWithoutFeedback onPress={this._doPicker.bind(this, rowItem.type)}>
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
                let avatar = {
                    uri: image.path,
                    type: image.mime,
                    data: image.data
                }
                this.setState({ avatar })
            });
        } else {
            ImagePicker.openPicker(AppConfig._configImagePicker()).then(image => {
                let avatar = {
                    uri: image.path,
                    type: image.mime,
                    data: image.data
                }
                this.setState({ avatar })
            });
        }
    }

    async _doUpdateChild() {
        const { childId, name, birthday, genderSelected, avatar, colorSelected } = this.state;
        if (name && birthday && genderSelected) {
            this.setState({ isHandling: true });
            let timeOut = this._timeoutCancelHandling();
            let userToken = this.props.user.apiKey;
            let _data = {
                child_id: childId,
                name,
                birthday: moment(birthday).format('DD-MM-YYYY'),
                gender: genderSelected,
                color: colorSelected
            }
            if (avatar && typeof avatar == 'string') {
                _data.avatar = avatar;
            } else if (avatar && typeof avatar == 'object') {
                _data.avatar = {
                    uri: avatar.uri,
                    type: avatar.type,
                    name: `${name}-avatar`,
                    data: avatar.data
                }
            };
            let response = await sf.getServices("ChildService").update(_data, userToken);
            this.setState({ isHandling: false });
            clearTimeout(timeOut);
            if (response && response.status == 200 && response.data && response.data.child_info && !response.data.error) {
                response.data.child_info.avatar = (response.data.avatar && response.data.avatar.length > 0) ? response.data.avatar[0].source : null;
                this._setChildToStore(response.data.child_info);
                this.props.navigation.state.params._updateChildList(response.data.child_info, 1, response.data.avatar ? response.data.avatar[0] : null);
                this.props.navigation.goBack(null);
                notice.inform(notice.message.success);
            } else notice.inform(notice.message.errorServer)
        } else notice.inform(notice.message.invalidData)
    }

    _setChildToStore(child) {
        let _childs = this.props.child.list;
        let indexUpdated = _childs.map((c) => c.id).indexOf(child.id);
        _childs[indexUpdated] = child;
        this.props._actionSetChild(child);
        this.props._actionSetChildList(_childs);
    }

    _timeoutCancelHandling() {
        let timeOut = setTimeout(() => this.setState({ isHandling: false }), 60000)
        return timeOut;
    }

    _goPickColor = (colorSelected) => {
        this.navigate('listColor', { _selectedColor: this._selectedColor.bind(this), colorSelected });
    }

    _selectedColor(colorSelected) {
        this.setState({ colorSelected })
    }

    _mapChild(child, avatar) {
        return new Promise((resolve) => {
            this.setState({
                childId: child.id,
                name: child.name,
                birthday: _handleBirthday(child.birthday),
                avatar: (avatar && avatar[0]) ? avatar[0].source : null,
                genderSelected: child.gender,
                colorSelected: child.color
            })
            resolve();
        });
    }

    async componentWillMount() {
        this.setState({ isHandling: true });
        const { childId } = this.props.navigation.state.params;
        const userToken = this.props.user.apiKey;
        let response = await sf.getServices("ChildService").getOne(childId, userToken);
        this.setState({ isHandling: false });
        if (response && response.data && response.data.child_info && !response.data.error) {
            await this._mapChild(response.data.child_info, response.data.avatars);
        } else {
            this.props.navigation.goBack(null);
            notice.inform(notice.message.errorServer)
        }
    }

    componentDidMount() {

    }

    render() {
        const { name, birthday, genderSelected, colorSelected, avatar, isHandling } = this.state;
        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <View style={styles.container}>
                    <Header screenProps={this.props}>자녀 홈</Header>
                    <View style={styles.content}>
                        <View style={styles.viewAvatar}>
                            <TouchableWithoutFeedback onPress={this._goChangeAvatar.bind(this)}>
                                <View style={{ flex: 1, justifyContent: 'center' }}>
                                    {/* {!avatar && <TouchableWithoutFeedback onPress={this._goChangeAvatar.bind(this)}>
                                        <View style={styles.viewButton}>
                                            <Image style={styles.btcChangeAvatar}
                                                source={require('../../assets/icons/buttonUpload.png')}
                                                resizeMode="contain" />
                                        </View>
                                    </TouchableWithoutFeedback>} */}
                                    <ImageBackground style={[styles.avatar, { overflow: 'hidden' }]}
                                        source={(typeof avatar == 'string') ? { uri: _getAvatarChild(avatar) } : avatar ? { uri: avatar.uri } : require('../../assets/images/defaultChild.png')}
                                        resizeMode="cover">
                                    </ImageBackground>
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
                        </View>
                        <View style={styles.info}>
                            <AdvanceInput
                                title="자녀 이름"
                                propComponent={{
                                    placeholder: '자녀 이름',
                                    placeholderTextColor: mainColor.placeholder
                                }}
                                style={{
                                    borderColor: name ? buttonColor.borderActive : mainColor.inputBorder,
                                }}
                                value={name}
                                onChangeText={(_name) => this.setState({ name: _name })}
                                focusStyle={{ borderColor: buttonColor.borderActive }}
                                onRightAction={this._goPickColor.bind(this, colorSelected)}
                                rightActionColor={colorSelected}
                            />
                            <AdvanceInput
                                title="생년월일"
                                rightIcon={require("../../assets/icons/pickDate.png")}
                                propComponent={{
                                    placeholder: '',
                                    placeholderTextColor: mainColor.placeholder
                                }}
                                style={{
                                    borderColor: birthday ? buttonColor.borderActive : mainColor.inputBorder, marginTop: scale(20)
                                }}
                                isDatePicker
                                maximumDate={new Date()}
                                value={moment(_handleBirthday(birthday)).format('YYYY-MM-DD')}
                                onDateReturn={(_birthday) => this.setState({ birthday: _birthday })}
                                focusStyle={{ borderColor: buttonColor.borderActive }} />
                            <View style={styles.inputRadio}>
                                <View style={styles.titleInputRadio}>
                                    {/* <Image
                                        source={require("../../assets/icons/dotIcon.png")}
                                        style={styles.dotIcon}
                                        resizeMode="contain" /> */}
                                    <StandardText title style={{}}>자녀 성별</StandardText>
                                </View>
                                <View style={styles.viewGender}>
                                    <CustomRadioGroup
                                        value={genderSelected}
                                        textStyle={{ fontSize: scale(14) }}
                                        itemStyle={{ height: scale(35) }}
                                        data={this.relationOptions}
                                        onSelect={(genderSelected) => this.setState({ genderSelected })} />
                                </View>
                            </View>
                            <SimpleButton
                                onPress={this._doUpdateChild.bind(this)}
                                propComponent={{
                                    // disabled: (name && birthday && genderSelected && avatar) ? false : true
                                }}
                                style={Object.assign({ marginTop: scale(55) }, (name && birthday && genderSelected) ? styles.btnActiveStyle : styles.btnInactiveStyle)}
                                textStyle={(name && birthday && genderSelected && avatar) ? styles.textActiveStyle : styles.textInactiveStyle}>등록
                                </SimpleButton>
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
        _actionSetChild: (_child) => dispatch(_actionSetChild(_child)),
        _actionSetChildList: (_list) => dispatch(_actionSetChildList(_list))
    };
}

const mapStateToProps = state => ({
    user: state.user,
    child: state.child
});

export default connect(mapStateToProps, bindAction)(EditChild);