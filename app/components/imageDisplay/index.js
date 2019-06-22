import React from 'react'
import { View, TouchableWithoutFeedback } from 'react-native';
import PropTypes from 'prop-types';
import Modal from 'react-native-modalbox';
import Gallery from 'react-native-image-gallery';
import { Icon } from 'react-native-elements';
import StandardText from "../standardText";
import styles from "./styles";
import { mainColor } from '../../utils/styleUtils';
import { scale } from '../../utils/scalingUtils';

export default class ImageDisplay extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            isOpenModal: false
        }
    }

    _closeModal = () => {
        this.props.onClose();
    }

    render() {
        const { style } = this.props;
        return (
            <Modal
                isOpen={this.props.isVisible}
                position="center"
                style={[styles.modal]}
                ref={"modal"}
                swipeToClose={true}>
                <View style={styles.container}>
                    <View style={styles.toolbar}>
                        <TouchableWithoutFeedback onPress={this._closeModal.bind(this)}>
                            <Icon name='close'
                                type='material-community'
                                color='#fff'
                                size={scale(26)} />
                        </TouchableWithoutFeedback>
                    </View>
                    <View style={styles.content}>
                        <Gallery
                            style={{ flex: 1, backgroundColor: 'black' }}
                            images={this.props.sources}
                        />
                    </View>
                </View>
            </Modal>
        )
    }
}

ImageDisplay.propTypes = {
    isVisible: PropTypes.bool,
    sources: PropTypes.array
}

ImageDisplay.defaultProps = {
    style: {},
    isVisible: false
}