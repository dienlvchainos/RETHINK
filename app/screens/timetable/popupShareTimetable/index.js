
import React from 'react'
import { TouchableWithoutFeedback, Image, View, Keyboard } from 'react-native'
import { captureRef, captureScreen } from "react-native-view-shot";
import styles from './styles';
import StandardText from '../../../components/standardText';

export default class PopupShareTimetable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            
        }
    }

    shareOptions = [
        {
            id: 0,
            title: '이미지로 공유',
            icon: require('../../../assets/icons/pictureIcon1.png'),
        },
        {
            id: 1,
            title: '공유할 사람 초대',
            icon: require('../../../assets/icons/arrowRightIcon.png'),
        }
    ]

    _selectShare(indexOption) {
        this.props.onShareSelect(indexOption);
    }

    render() {
        return (
            <View style={styles.container}>
                <TouchableWithoutFeedback onPress={this._selectShare.bind(this, 0)}>
                    <View style={styles.itemPicker}>
                        <Image source={this.shareOptions[0].icon}
                            style={styles.icon}
                            resizeMode="contain" />
                        <StandardText>{this.shareOptions[0].title}</StandardText>
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={this._selectShare.bind(this, 1)}>
                    <View style={[styles.itemPicker, styles.border]}>
                        <Image source={this.shareOptions[1].icon}
                            style={styles.icon}
                            resizeMode="contain" />
                        <StandardText>{this.shareOptions[1].title}</StandardText>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        );
    }
}