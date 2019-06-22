import React from 'react'
import { TouchableWithoutFeedback, View, Image } from 'react-native';
// import PropTypes from 'prop-types'
import { Button, Icon } from 'react-native-elements';
import styles from "./styles";
import { _getAvatarChild } from '../../../helpers';

export default class Header extends React.PureComponent {

    _goDrawer() {
        const { navigate } = this.props.screenProps.navigation;
        navigate('drawer');
    }

    _goChild(item) {
        this.props.onSelectChild(item);
    }

    _renderChilds() {
        return this.props.childs.map((item, index) => {
            if (index < 5) {
                return <TouchableWithoutFeedback key={item.id} onPress={this._goChild.bind(this, item)}>
                    <View style={styles.btnIcon}>
                        <Image
                            style={styles.icon}
                            source={item.avatar ? { uri: _getAvatarChild(item.avatar) } : require("../../../assets/images/defaultChild.png")}
                            resizeMode="cover"
                        />
                    </View>
                </TouchableWithoutFeedback>
            }
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <Button
                    containerViewStyle={styles.btn}
                    transparent
                    rightIcon={{ name: 'ios-menu', type: 'ionicon', color: '#000', size: 40 }}
                    onPress={this._goDrawer.bind(this)} />
                <View style={styles.iconList}>
                    {this._renderChilds()}
                    <TouchableWithoutFeedback onPress={() => this.props.onGoNewChild()}>
                        <Image
                            style={styles.iconAction}
                            source={require("../../../assets/icons/addChild.png")}
                            resizeMode="cover"
                        />
                    </TouchableWithoutFeedback>
                </View>
            </View>
        )
    }
}