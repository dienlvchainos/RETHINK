import React, { Component } from 'react';
import { View, TouchableWithoutFeedback, TouchableHighlight } from 'react-native';
import Modal from "react-native-modal";
import { CheckBox } from 'react-native-elements'
import styles from './popupPolicyStyles';
import StandardText from '../../../components/standardText';
import UnderlineText from '../../../components/underlineText';
import { scale } from '../../../utils/scalingUtils';
import { mainColor, buttonColor } from '../../../utils/styleUtils';
import notice from "../../../utils/noticeUtils";

export default class PopupPolicy extends Component {

    state = {
        visible: this.props.isVisible,
        checkAgree: false
    }

    _goPolicy() {

    }

    _cancelModal() {
        this.props.navigationProps.goBack()
    }

    _doAccept() {
        let { checkAgree } = this.state;
        if (checkAgree) {
            this.setState({ visible: false })
        } else {
            notice.inform(notice.message.acceptPolicy);
        }
    }

    render() {
        const { visible } = this.state;
        return (
            <Modal isVisible={visible}>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <StandardText large>알린더 사용 동의</StandardText>
                    </View>
                    <View style={styles.content}>
                        <View style={styles.content1}>
                            <TouchableWithoutFeedback onPress={this._goPolicy.bind(this)}>
                                <UnderlineText style={{ marginLeft: scale(20) }}><StandardText normal>•이용약관</StandardText></UnderlineText>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={this._goPolicy.bind(this)}>
                                <UnderlineText style={{ marginLeft: scale(20), marginTop: scale(17) }}><StandardText normal>•개인정보 취급방침</StandardText></UnderlineText>
                            </TouchableWithoutFeedback>
                            <CheckBox
                                containerStyle={{ marginLeft: scale(10), marginTop: scale(17), borderWidth: 0, backgroundColor: 'transparent' }}
                                wrapperStyle={{ borderColor: '#DDE5F6' }}
                                checked={this.state.checkAgree}
                                uncheckedColor="#DDE5F6"
                                checkedColor={mainColor.main}
                                title="위의 각 항목에 동의합니다"
                                textStyle={styles.textCheckbox}
                                onPress={() => this.setState({ checkAgree: !this.state.checkAgree })}
                            />
                        </View>
                        <View style={styles.content2}>
                            <TouchableHighlight style={styles.btn} underlayColor={buttonColor.underlay} onPress={this._cancelModal.bind(this)}>
                                <StandardText title>취소</StandardText>
                            </TouchableHighlight>
                            <TouchableHighlight style={styles.btn} underlayColor={buttonColor.underlay} onPress={this._doAccept.bind(this)}>
                                <StandardText title>동의</StandardText>
                            </TouchableHighlight>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }
}