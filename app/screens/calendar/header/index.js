import React from 'react'
import { TouchableWithoutFeedback, TouchableHighlight, View } from 'react-native';
import PropTypes from 'prop-types'
import { Button, Icon } from 'react-native-elements';
import StandardText from '../../../components/standardText';
import styles from "./styles";
import { scale } from '../../../utils/scalingUtils';
import { Fonts } from '../../../utils/styleUtils';
import UnderlineText from '../../../components/underlineText';
export default class HeaderCalendar extends React.Component {

    _backScreen() {
        // alert(1);
        // if (this.props.onBack) {
        //     this.props.onBack();
        // }
        const { goBack } = this.props.screenProps.navigation;
        goBack(null);
    }

    render() {
        return (
            <View style={styles.container}>
                <TouchableHighlight onPress={this._backScreen.bind(this)}>
                    <View style={styles.viewBack}>
                        {/* <Icon name="ios-arrow-round-back"
                            type="ionicon"
                            color="#000"
                            size={40}
                            onPress={this._backScreen.bind(this)} /> */}
                    </View>
                </TouchableHighlight>
                <StandardText large style={{ flex: 1, textAlign: 'center', marginLeft: scale(-60) }}>
                    {/* {this.props.currentDate.year + '년 ' + this.props.currentDate.month + '월'} */}
                    캘린더
                </StandardText>
            </View>
        )
    }
}

HeaderCalendar.propTypes = {
    currentDate: PropTypes.object
}