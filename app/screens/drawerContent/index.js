import React from 'react'
import { TouchableWithoutFeedback, View, Text, Image } from 'react-native'
import Swiper from 'react-native-swiper';
import BaseScreen from '../baseScreen'
import Header from './header';
import { connect } from 'react-redux';
import styles from './styles';
import { mainColor } from '../../utils/styleUtils';
import { scale } from '../../utils/scalingUtils';
import StandardText from '../../components/standardText';
import UnderlineText from '../../components/underlineText';
import { Icon } from 'react-native-elements';

class DrawerContent extends BaseScreen {
    constructor(props) {
        super(props)
    }

    _goInvite() {
        this.navigate('shareSchedule');
    }

    _doAbout() {

    }

    componentDidMount() {

    }

    render() {
        return (
            <View style={styles.container}>
                <Header screenProps={this.props} user={this.props.user.data} />
                <View style={styles.slide}>
                    <Swiper style={styles.slideWrapper}
                        showsButtons={true}
                        showsButtons={false}
                        paginationStyle={{ paddingRight: scale(15), justifyContent: 'flex-end', position: 'absolute', bottom: 20 }}
                        activeDotColor='#fff'
                        dotColor='rgba(255, 255, 255, .5)'
                    >
                        <Image style={styles.slideItem}
                            source={require('../../assets/images/banner1.png')}
                            resizeMode="cover"
                        />
                        <Image style={styles.slideItem}
                            source={require('../../assets/images/banner1.png')}
                            resizeMode="cover" />
                    </Swiper>
                </View>
                <View style={styles.about}>
                    <TouchableWithoutFeedback onPress={this._goInvite.bind(this)}>
                        <View style={styles.btnAbout}>
                            <Image style={styles.iconBtn}
                                source={require('../../assets/icons/inviteIcon.png')}
                                resizeMode="contain" />
                            <StandardText small>초대하기</StandardText>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
                <View style={styles.suggest}>
                    <UnderlineText style={{ marginBottom: scale(10) }}><StandardText>서비스소개</StandardText></UnderlineText>
                    <View style={styles.suggestApp}>
                        <View style={styles.suggestItem}>
                            <Image style={styles.iconSuggestApp}
                                source={require('../../assets/icons/appExampleIcon.png')}
                                resizeMode="contain" />
                            <StandardText small style={{ marginTop: scale(12) }}>Qustodio</StandardText>
                        </View>
                        <View style={styles.suggestItem}>
                            <Image style={styles.iconSuggestApp}
                                source={require('../../assets/icons/appExampleIcon.png')}
                                resizeMode="contain" />
                            <StandardText small style={{ marginTop: scale(12) }}>Qustodio</StandardText>
                        </View>
                        <View style={styles.suggestItem}>
                            <Image style={styles.iconSuggestApp}
                                source={require('../../assets/icons/appExampleIcon.png')}
                                resizeMode="contain" />
                            <StandardText small style={{ marginTop: scale(12) }}>Qustodio</StandardText>
                        </View>
                        <View style={styles.suggestItem}>
                            <Image style={styles.iconSuggestApp}
                                source={require('../../assets/icons/appExampleIcon.png')}
                                resizeMode="contain" />
                            <StandardText small style={{ marginTop: scale(12) }}>Qustodio</StandardText>
                        </View>
                    </View>
                </View>
                <View style={styles.policy}>
                    <TouchableWithoutFeedback onPress={this._goRules}>
                        <View style={[styles.btnAbout, styles.btnAbout1]}>
                            <StandardText small>이용약관</StandardText>
                            <Icon name='chevron-right'
                                type='material-community'
                                color='#000'
                                size={scale(26)} />
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={this._goPolicy}>
                        <View style={[styles.btnAbout, styles.btnAbout1, { borderLeftWidth: scale(1), borderColor: mainColor.seperateColor }]}>
                            <StandardText small>개인정보처리방침</StandardText>
                            <Icon name='chevron-right'
                                type='material-community'
                                color='#000'
                                size={scale(26)} />
                        </View>
                    </TouchableWithoutFeedback>
                </View>
                <View style={styles.about}>
                    <TouchableWithoutFeedback onPress={this._doAbout}>
                        <View style={[styles.btnAbout, { borderLeftWidth: scale(1), borderColor: mainColor.seperateColor }]}>
                            <Image style={styles.iconBtn}
                                source={require('../../assets/icons/aboutIcon.png')}
                                resizeMode="contain" />
                            <StandardText small>서비스소개</StandardText>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
                <View style={styles.version}>
                    <Text style={styles.textVersion}>버전 1.0.0</Text>
                    <Text style={styles.textVersion}>최신버전입니다.</Text>
                </View>
            </View>
        )
    }

}

function bindAction(dispatch) {
    return {

    };
}

const mapStateToProps = state => ({
    user: state.user
});

export default connect(mapStateToProps, bindAction)(DrawerContent);