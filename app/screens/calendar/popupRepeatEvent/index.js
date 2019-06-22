import React from 'react'
import { TouchableWithoutFeedback, View, Image } from 'react-native';
import PropTypes from 'prop-types'
import { Icon } from 'react-native-elements';
import { buttonColor, mainColor } from "../../../utils/styleUtils";
import SimpleButton from '../../../components/simpleButton';
import CustomRadioGroup from '../../../components/customRadioGroup';
import { scale } from '../../../utils/scalingUtils';
import Modal from 'react-native-modalbox';
import StandardText from '../../../components/standardText';

import styles from "./styles";

export default class PopupRepeatEvent extends React.PureComponent {
    static propTypes = {
        data: PropTypes.array,
        containerStyle: PropTypes.object,
        value: PropTypes.object,
        dropdownStyle: PropTypes.object,
        isVisible: PropTypes.bool,
        width: PropTypes.any,
        height: PropTypes.any,
        onOk: PropTypes.func
    }

    constructor(props) {
        super(props)
        this.state = {
            repeatSelected: props.repeatSelected || 'none',
            selectedRepeat: { id: 0, label: '없음', value: 'none' }
        }
    }

    _dataRepeats = [
        { id: 0, label: '없음', value: 'none' },
        { id: 1, label: '매주', value: 'weekly' },
        { id: 2, label: '매년', value: 'yearly' },
        { id: 3, label: '매일', value: 'daily' },
        { id: 4, label: '매월', value: 'monthly' },
    ]

    _doAccept() {
        this.props.onAccept(this.state.selectedRepeat);
    }

    _onClose() {
        this.props.onClose();
    }

    _doSelectRepeat(selectedRepeat) {
        this.setState({ selectedRepeat })
    }

    componentWillReceiveProps(nextProps) {
        // console.log("componentWillReceiveProps", nextProps)

        // if(nextProps.selectedRepeat != this.props.selectedRepeat) {
        //     this.setState({
        //         selectedRepeat: nextProps.selectedRepeat
        //     })
        // }
    }

    render() {
        return (
            <Modal
                isOpen={this.props.isVisible}
                position={this.props.position ? this.props.position : 'center'}
                backdropOpacity={0.5}
                style={[styles.modal, this.props.containerStyle, this.props.height ? { height: scale(this.props.height) } : {}, this.props.width ? { width: scale(this.props.width) } : {}]}
                ref={'modal'}
                swipeToClose={false}
                onClosed={this._onClose.bind(this)}>
                <TouchableWithoutFeedback onPress={() => { }}>
                    <View style={styles.containerModal}>
                        <View style={styles.header}>
                            <Image source={require("../../../assets/icons/exchangeIcon.png")}
                                style={styles.icon}
                                resizeMode="contain" />
                            <StandardText large>반복 일정인강요?</StandardText>
                        </View>
                        <View style={styles.content}>
                            <CustomRadioGroup
                                style={{ alignItems: 'flex-start' }}
                                itemStyle={styles.itemStyle}
                                data={this._dataRepeats}
                                value={this.props.repeatSelected}
                                onSelect={this._doSelectRepeat.bind(this)} />
                        </View>
                        <View style={styles.repeatAction}>
                            <SimpleButton
                                onPress={this._doAccept.bind(this)}
                                propComponent={{
                                    underlayColor: buttonColor.underlay
                                }}
                                style={styles.btnLeftModal}
                                textStyle={{}}>복사</SimpleButton>
                            <SimpleButton
                                onPress={this._onClose.bind(this)}
                                propComponent={{
                                    underlayColor: buttonColor.underlay
                                }}
                                style={styles.btnModal}
                                textStyle={{}}>삭제</SimpleButton>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        );
    }
}