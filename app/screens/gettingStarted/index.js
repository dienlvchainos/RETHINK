import React from 'react'
import { TouchableHighlight, View, Text, Image, BackHandler } from 'react-native'
import BaseScreen from '../baseScreen'
import { connect } from 'react-redux';
import { _actionSetUser } from '../../actions/userAction';
import styles from './styles';
import { mainColor } from '../../utils/styleUtils';
import { _getStorage } from '../../utils/storeUtils';
import constants from '../../constants';
import LoadingScreen from '../../components/loadingScreen';

class GettingStarted extends BaseScreen {

    constructor(props) {
        super(props);
        this.state = {
            isHandling: false
        }
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid.bind(this));
        // let userLogged = await _getStorage(constants.userLogged);
        // if (userLogged) {
        //     const _user = JSON.parse(userLogged);
        //     this.props._actionSetUser(_user.user_info, _user.user_info.api_key);
        //     this.setState({ isHandling: false });
        //     this.navigate('overview', { initDone: true });
        // } else {
        //     this.setState({ isHandling: false });
        // }
    }

    onBackButtonPressAndroid() {
        // return true;
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid.bind(this));
    }

    _goSignup = () => {
        this.navigate('register')
    }

    _goSignin = () => {
        this.navigate('login')
    }

    render() {
        const { isHandling } = this.state;
        if (isHandling) {
            return <View style={styles.container}>
                <LoadingScreen />
            </View>
        }
        return (
            <View style={styles.container}>
                <Image
                    style={styles.img}
                    resizeMode="contain"
                    source={require('../../assets/images/app-image.png')}
                />
                <View style={styles.content}>
                    <TouchableHighlight
                        style={styles.btn}
                        underlayColor={mainColor.buttonActive}
                        onPress={this._goSignup}
                    >
                        <Text style={styles.txtBtn}>가입하기 (신규 사용자)</Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                        style={styles.btn}
                        underlayColor={mainColor.buttonActive}
                        onPress={this._goSignin}
                    >
                        <Text style={styles.txtBtn}>로그인 (기존 사용자)</Text>
                    </TouchableHighlight>
                </View>
            </View>
        )
    }

}

function bindAction(dispatch) {
    return {
        _actionSetUser: (userInfo, userToken) => dispatch(_actionSetUser(userInfo, userToken))
    };
}

const mapStateToProps = state => ({
    user: state.user
});

export default connect(mapStateToProps, bindAction)(GettingStarted);