import React from 'react'
import { TouchableWithoutFeedback, View } from 'react-native';
import PropTypes from 'prop-types'
import { Icon } from 'react-native-elements';
import { buttonColor, mainColor } from "../../utils/styleUtils";
import { scale } from '../../utils/scalingUtils';
import Modal from 'react-native-modalbox';
import StandardText from '../standardText';
import styles from "./styles";

export default class BottomSheet extends React.PureComponent {
    static propTypes = {
        data: PropTypes.array,
        containerStyle: PropTypes.object,
        value: PropTypes.object,
        dropdownStyle: PropTypes.object,
        isVisible: PropTypes.bool,
        height: PropTypes.any
    }

    constructor(props) {
        super(props)
        this.state = {

        }
    }

    _onClose() {
        this.props.onClose();
    }

    render() {
        return (
            <Modal
                isOpen={this.props.isVisible}
                position={this.props.position ? this.props.position : 'bottom'}
                backdropOpacity={0.5}
                style={[{margin: 0, padding: 0}, this.props.style || {}, this.props.height ? { height: this.props.height} : {}]}
                // style={[styles.modal, this.props.containerStyle, this.props.height ? { height: scale(this.props.height) } : {}]}
                ref={'modal'}
                coverScreen={true}
                animationDuration={500}
                swipeToClose={this.props.swipeToClose ? this.props.swipeToClose : false}
                backButtonClose={true}
                avoidKeyboard
                onClosed={this._onClose.bind(this)}>
                <View style={styles.containerModal}>
                    {this.props.children}
                </View>
            </Modal>
        );
    }
}