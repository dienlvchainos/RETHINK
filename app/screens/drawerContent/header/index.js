import React from 'react'
import { View, Image, TouchableWithoutFeedback } from 'react-native';
import { Button } from 'react-native-elements';
import StandardText from '../../../components/standardText';
import { Icon } from 'react-native-elements';
import styles from "./styles";
import { Fonts } from '../../../utils/styleUtils';
import { _getAvatarUser, _renderRelationship } from '../../../helpers';

export default class Header extends React.PureComponent {

    _backScreen() {
        const { goBack } = this.props.screenProps.navigation;
        goBack(null);
    }

    _goUserProfile() {
        this.props.screenProps.navigation.navigate('userProfile');
    }

    render() {
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
                <View style={styles.info}>
                    <View style={styles.avatar}>
                        <Image
                            style={styles.icon}
                            source={this.props.user.avatar ? { uri: _getAvatarUser(this.props.user.avatar) } : require('../../../assets/images/user_image.png')}
                            resizeMode="cover"
                        />
                    </View>
                    <StandardText large>{this.props.user.username}
                        <StandardText large style={{ fontWeight: 'normal', ...Fonts.NanumBarunGothic_Regular }}>
                            {this.props.user.relationship ? '(' + _renderRelationship(this.props.user.relationship) + ')' : null}
                        </StandardText>
                    </StandardText>
                </View>
                <Button
                    containerViewStyle={styles.btnRightIcon}
                    transparent
                    rightIcon={{ name: 'chevron-right', type: 'material-community', color: '#000', size: 35 }}
                    onPress={this._goUserProfile.bind(this)} />
            </View>
        )
    }
}