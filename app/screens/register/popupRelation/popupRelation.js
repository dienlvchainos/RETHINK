import React, { Component } from 'react';
import { View, TouchableWithoutFeedback, TouchableHighlight } from 'react-native';
import Modal from "react-native-modal";
import styles from './popupRelationStyles';
import StandardText from '../../../components/standardText';
import CustomRadioGroup from '../../../components/customRadioGroup';
import { scale } from '../../../utils/scalingUtils';
import { buttonColor } from '../../../utils/styleUtils';
import noticeUtils from '../../../utils/noticeUtils';

export default class PopupRelation extends Component {

    constructor(props) {
        super(props);
        this.state = {
            checkAgree: false,
            radioMother: false,
            selected: null,
            relationOptions: [
                { label: '엄마', id: 0, value: 'mother', selected: false },
                { label: '아빠', id: 1, value: 'father', selected: false },
                { label: '할아버지', id: 2, value: 'grandfather', selected: false },
                { label: '할머니', id: 3, value: 'grandmother', selected: false },
                { label: '기타', id: 4, value: 'other', note: '이모, 고모, 돌봄직원, ...', selected: false }
            ]
        }
    }

    _doRegister() {
        if(this.state.selected) {
            this.props.onRegister(this.state.selected);
            this._dismissModal();
        } else noticeUtils.inform(noticeUtils.message.selectRelationship)
    }

    _dismissModal() {
        this.props.onDismiss();
    }

    render() {
        const relationOptions  = this.state.relationOptions
        const visible = this.props.isVisible
        return (
            <Modal isVisible={visible}
                onBackdropPress={this._dismissModal.bind(this)}>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <StandardText large>나는 아이의_______입니다.</StandardText>
                    </View>
                    <View style={styles.content}>
                        <View style={styles.content1}>
                            <CustomRadioGroup
                                itemStyle={{ height: scale(35) }}
                                data={relationOptions}
                                onSelect={(selected) => this.setState({ selected })} />
                        </View>
                        <View style={styles.content2}>
                            <TouchableHighlight style={styles.btn} underlayColor={buttonColor.underlay} onPress={this._doRegister.bind(this)}>
                                <StandardText title>확인</StandardText>
                            </TouchableHighlight>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }
}