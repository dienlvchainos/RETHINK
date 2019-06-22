import React from 'react'
import { TouchableWithoutFeedback, View } from 'react-native';
import PropTypes from 'prop-types'
import { Button } from 'react-native-elements';
import StandardText from '../standardText';
import UnderlineText from '../underlineText';
import { scale } from '../../utils/scalingUtils';
import styles from "./styles";
import { Fonts, sizeStandard } from '../../utils/styleUtils';
import { Icon } from 'react-native-elements';
export default class Header extends React.Component {

    _backScreen() {
        if (this.props.onBack) {
            return this.props.onBack();
        }
        const { goBack } = this.props.screenProps.navigation;
        goBack(null);
    }

    render() {
        const { rightButton, rightButtonOnpress, rightButtonText } = this.props;
        return (
            <View style={styles.container}>
                <TouchableWithoutFeedback onPress={this._backScreen.bind(this)}>
                    <View style={styles.btnBack}>
                        <Icon name="ios-arrow-round-back"
                            type="ionicon"
                            color="#000"
                            size={40}/>
                    </View>
                </TouchableWithoutFeedback>
                <StandardText large>{this.props.children}</StandardText>
                {rightButton && <Button
                    containerViewStyle={styles.btnRightIcon}
                    transparent
                    rightIcon={{ name: 'ios-arrow-round-back', type: 'ionicon', color: '#000', size: 40 }}
                    onPress={rightButtonOnpress} />}
                {!!rightButtonText && <TouchableWithoutFeedback onPress={rightButtonOnpress}>
                    <View style={styles.btnRightIcon}>
                        <UnderlineText style={{ marginEnd: scale(sizeStandard.paddingContent) }}>
                            <StandardText large style={{ ...Fonts.NanumBarunGothic_Regular }}>{rightButtonText}</StandardText>
                        </UnderlineText>
                    </View>
                </TouchableWithoutFeedback>}
            </View>
        )
    }
}

Header.propTypes = {
    rightButton: PropTypes.bool,
    rightButtonOnpress: PropTypes.func,
    onBack: PropTypes.func,
    rightButtonText: PropTypes.string,

}