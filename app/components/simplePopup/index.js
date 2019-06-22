import React from 'react'
import { TouchableWithoutFeedback, View } from 'react-native';
import PropTypes from 'prop-types'
import { Icon } from 'react-native-elements';
import { buttonColor, mainColor } from "../../utils/styleUtils";
import SimpleButton from '../simpleButton';
import { scale } from '../../utils/scalingUtils';
import Modal from 'react-native-modalbox';
import StandardText from '../standardText';
import styles from "./styles";

export default class SimplePopup extends React.PureComponent {
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

        }
    }

    _onClose() {
        this.props.onClose();
    }

    _onOk() {
        this.props.onOk();
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
                <View style={styles.containerModal}>
                    <View style={styles.content}>
                        {!!this.props.text1 && <StandardText large>{this.props.text1}</StandardText>}
                        {!!this.props.text2 && <StandardText title style={{marginTop: scale(5)}}>{this.props.text2}</StandardText>}
                    </View>
                    <View style={styles.actions}>
                        <SimpleButton
                            onPress={this._onOk.bind(this)}
                            propComponent={{
                                underlayColor: buttonColor.underlay
                            }}
                            style={styles.btnOk}
                            textStyle={styles.textActiveStyle}>OK</SimpleButton>
                    </View>
                </View>
            </Modal>
        );
    }
}