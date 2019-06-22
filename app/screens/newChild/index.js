import React from 'react'
import { TouchableWithoutFeedback, View, Keyboard, ImageBackground, Image } from 'react-native'
import BaseScreen from '../baseScreen'
import { connect } from 'react-redux';
import ModalDropdown from 'react-native-modal-dropdown';
import ImagePicker from 'react-native-image-crop-picker';
import Header from "../../components/header";
import styles from './styles';
import { mainColor, buttonColor } from '../../utils/styleUtils';
import { scale } from '../../utils/scalingUtils';
import { _handleBirthday, _getAvatarChild, _timeoutCancelHandling } from '../../helpers';
import { _actionSetChildList, _actionSetChild } from '../../actions/childAction';
import sf from '../../libs/serviceFactory';
import moment from 'moment';
import notice from '../../utils/noticeUtils';
import StandardText from '../../components/standardText';
import AdvanceInput from '../../components/advanceInput';
import SimpleButton from '../../components/simpleButton';
import CustomRadioGroup from '../../components/customRadioGroup';
import LoadingScreen from '../../components/loadingScreen';
import languageUtils from '../../utils/languageUtils';
import constants from '../../constants';
import AppConfig from '../../config';

class NewChild extends BaseScreen {

    constructor(props) {
        super(props);
        this.state = {
            name: null,
            birthday: null,
            genderSelected: null,
            colorSelected: '#000',
            avatar: null,
            isHandling: false
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
                this.setState({ user: { ...this.state.user, avatar: image.path } });
                let avatar = {
                    uri: image.path,
                    type: image.mime,
                    data: image.data
                }
                this.setState({ avatar })
            });
        }
    }

    async _doCreateChild() {
        const { name, birthday, genderSelected, avatar, colorSelected } = this.state;
        if (name && birthday && genderSelected) {
            this.setState({ isHandling: true });
            let timeOut = _timeoutCancelHandling(() => this.setState({ isHandling: false }));
            let userToken = this.props.user.apiKey;
            let _data = {
                name,
                birthday: moment(birthday).format('DD-MM-YYYY'),
                gender: genderSelected,
                color: colorSelected,
                avatar: avatar ? {
                    uri: avatar.uri,
                    type: avatar.type,
                    name: `${name}-avatar`,
                    data: avatar.data
                } : ''
            }
            let response = await sf.getServices("ChildService").create(_data, userToken);
            this.setState({ isHandling: false });
            clearTimeout(timeOut);
            if (response && response.status == 200 && response.data && !response.data.error) {
                this._resetForm();
                notice.inform(notice.message.success);
                response.data.child_info.avatar = response.data.avatar.source;
                this._setChildToStore(response.data.child_info);
                this._returnChildToList(response.data.child_info, response.data.avatar ? response.data.avatar : null);
            } else notice.inform(notice.message.errorServer)
        } else notice.inform(notice.message.invalidData)
    }

    _setChildToStore(child) {
        let _childs = this.props.child.list;
        if(this.props.child.list.length == 0) {
            this.props._actionSetChild(child);
        }
        // if (this.props.child.selected && !this.props.child.selected.name) {
        //     this.props._actionSetChild(child);
        // }
        _childs.push(child);
        this.props._actionSetChildList(_childs);
    }

    _returnChildToList(child, objAvatar) {
        child.birthday = _handleBirthday(child.birthday);
        this.props.navigation.state.params._updateChildList(child, 0, objAvatar);
        this.props.navigation.goBack(null);
    }

    _resetForm() {
        this.setState({
            avatar: null,
            name: null,
            birthday: null,
            genderSelected: null,
            colorSelected: '#000'
        })
    }

    _goPickColor = () => {
        Keyboard.dismiss();
        this.navigate('listColor', { _selectedColor: this._selectedColor.bind(this) });
    }

    _selectedColor(colorSelected) {
        this.setState({ colorSelected })
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
                                <ImageBackground style={[styles.avatar, { overflow: avatar ? 'hidden' : null }]}
                                    source={avatar ? { uri: avatar.uri } : require('../../assets/images/defaultChild.png')}
                                    resizeMode="contain">
                                    {/* {!avatar && <TouchableWithoutFeedback onPress={this._goChangeAvatar.bind(this)}>
                                        <View style={styles.viewButton}>
                                            <Image style={styles.btcChangeAvatar}
                                                source={require('../../assets/icons/buttonUpload.png')}
                                                resizeMode="contain" />
                                        </View>
                                    </TouchableWithoutFeedback>} */}
                                    <ModalDropdown
                                        ref={ref => this._pickerImage = ref}
                                        dropdownStyle={styles.pickerContainer}
                                        options={this.optionImagePicker}
                                        renderRow={this._renderRowPicker}
                                        renderButtonText={(rowData) => this._renderButtonText(rowData)}
                                        defaultValue=""
                                        onSelect={this._doPicker.bind(this)}
                                    />
                                </ImageBackground>
                            </TouchableWithoutFeedback>
                        </View>
                        <View style={styles.info}>
                            <AdvanceInput
                                title="자녀 이름"
                                propComponent={{
                                    placeholder: '자녀 이름',
                                    placeholderTextColor: mainColor.placeholder,
                                    value: name
                                }}
                                style={{
                                    borderColor: name ? buttonColor.borderActive : mainColor.inputBorder,
                                }}
                                onChangeText={(_name) => this.setState({ name: _name })}
                                focusStyle={{ borderColor: buttonColor.borderActive }}
                                onRightAction={this._goPickColor.bind(this)}
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
                                value={birthday}
                                onDateReturn={(_birthday) => this.setState({ birthday: _birthday })}
                                focusStyle={{ borderColor: buttonColor.borderActive }} />
                            <View style={styles.inputRadio}>
                                <View style={styles.titleInputRadio}>
                                    <Image
                                        source={require("../../assets/icons/dotIcon.png")}
                                        style={styles.dotIcon}
                                        resizeMode="contain" />
                                    <StandardText title style={{ marginLeft: scale(5) }}>자녀 성별</StandardText>
                                </View>
                                <View style={styles.viewGender}>
                                    <CustomRadioGroup
                                        textStyle={{ fontSize: scale(14) }}
                                        itemStyle={{ height: scale(35) }}
                                        data={this.relationOptions}
                                        onSelect={(genderSelected) => this.setState({ genderSelected })} />
                                </View>
                            </View>
                            <SimpleButton
                                onPress={this._doCreateChild.bind(this)}
                                propComponent={{
                                    disabled: (name && birthday && genderSelected) ? false : true
                                }}
                                style={Object.assign({ marginTop: scale(55) }, (name && birthday && genderSelected) ? styles.btnActiveStyle : styles.btnInactiveStyle)}
                                textStyle={(name && birthday && genderSelected) ? styles.textActiveStyle : styles.textInactiveStyle}>등록
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
        _actionSetChildList: (_list) => dispatch(_actionSetChildList(_list)),
        _actionSetChild: (_child) => dispatch(_actionSetChild(_child)),
    };
}

const mapStateToProps = state => ({
    user: state.user,
    child: state.child
});

export default connect(mapStateToProps, bindAction)(NewChild);