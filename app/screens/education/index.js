import React from 'react'
import { TouchableWithoutFeedback, View, Image, ScrollView, FlatList, Dimensions, Alert } from 'react-native'
import BaseScreen from '../baseScreen'
import { Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import styles from './styles';
import Header from "../../components/header";
import StandardText from '../../components/standardText';
import { scale } from '../../utils/scalingUtils';
import sf from '../../libs/serviceFactory';
import LoadingScreen from '../../components/loadingScreen';
import notice from "../../utils/noticeUtils";
import { _formatMoney, _handleDateObject } from '../../helpers';
import moment from 'moment';
moment.locale('kr', {
    months: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
    monthsShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월']
});

const width = Dimensions.get('window').width;

class Education extends BaseScreen {

    constructor(props) {
        super(props)
        this.state = {
            educations: []
        }
    }

    _goCreateEducation() {
        this.navigate('newEducation', { _updateListEducations: this._updateListEducations.bind(this) });
    }

    _goDeleteEdu(edu) {
        Alert.alert(
            '교육 기관 삭제?',
            '이 교육 기관을 삭제 하시겠습니까?',
            [
                { text: '삭제', onPress: () => this._doDeleteEdu(edu.id) },
                {
                    text: '취소',
                    onPress: () => { },
                    style: 'cancel',
                }
            ],
            { cancelable: true },
        );
    }

    async _doDeleteEdu(eduID) {
        const userToken = this.props.user.apiKey;
        let { educations } = this.state;
        let respon = await sf.getServices('EducationService').delete(eduID, userToken);
        if (respon && respon.status == 200) {
            let _indexRemove = educations.map(e => e.id).indexOf(eduID);
            educations.splice(_indexRemove, 1);
            this.setState({ educations })
        } else notice.inform(notice.message.errorWhenDelete);
    }

    _renderEducation({ item }) {
        return <TouchableWithoutFeedback onPress={this._goDeleteEdu.bind(this, item)}>
            <View style={styles.itemEducation}>
                <Image source={require('../../assets/icons/schoolIcon.png')}
                    style={styles.iconEducation}
                    resizeMode="contain"
                />
                <StandardText title style={{ marginTop: scale(6), textAlign: 'center' }}>{item.name}</StandardText>
                <View style={[styles.viewTextCreate]}>
                    <StandardText small style={{ marginTop: scale(3) }}>{'과목: ' + item.subject}</StandardText>
                    <StandardText small style={{ marginTop: scale(3) }}>{'월 비용: ' + _formatMoney(item.fee) + ' 만원'}</StandardText>
                    <StandardText small style={{ marginTop: scale(3) }}>{`납입 일: ${item.payment_date ? moment(item.payment_date).format('LL') : ''}`}</StandardText>
                </View>
            </View>
        </TouchableWithoutFeedback>
    }

    _renderCreateEducation() {
        return <TouchableWithoutFeedback onPress={this._goCreateEducation.bind(this)}>
            <View style={styles.itemEducation}>
                <Image source={require('../../assets/images/education.png')}
                    style={styles.imgEducationCreate}
                    resizeMode="contain"
                />
                <View style={[styles.inRow, styles.viewTextCreate]}>
                    <Icon name='plus-circle'
                        type='material-community'
                        color='#EDEFEF'
                        size={scale(15)} />
                    <StandardText regular style={{ marginLeft: scale(3), color: '#EDEFEF', fontSize: scale(12) }}>교육기관등록</StandardText>
                </View>
            </View>
        </TouchableWithoutFeedback>
    }

    _updateListEducations(edu) {
        if (edu.payment_date) edu.payment_date = _handleDateObject(edu.payment_date);
        let { educations } = this.state;
        educations.push(edu);
        this.setState({ educations });
    }

    async componentDidMount() {
        const userToken = this.props.user.apiKey;
        let eduRespon = await sf.getServices('EducationService').getList(userToken);
        if (eduRespon && eduRespon.status == 200 && eduRespon.data && !eduRespon.data.error) {
            this.setState({ educations: eduRespon.data })
        } else {
            notice.inform(notice.message.errorServer);
        }
    }

    render() {
        const { educations } = this.state;
        return (
            <View style={styles.container}>
                <Header screenProps={this.props}>교육기관</Header>
                {educations.length > 0
                    ? <View style={styles.content}>
                        {/* <View style={styles.headerList}>
                            <UnderlineText style={{}}><StandardText>교육기관</StandardText></UnderlineText>
                        </View> */}
                        <View style={styles.list}>
                            <ScrollView>
                                <FlatList
                                    data={educations}
                                    extraData={this.state}
                                    numColumns={Math.round((width - scale(17 * 2)) / scale(155))}
                                    keyExtractor={(item, index) => String(item.id)}
                                    renderItem={this._renderEducation.bind(this)}
                                    ListFooterComponent={this._renderCreateEducation.bind(this)}
                                />
                            </ScrollView>
                        </View>
                    </View>
                    : <TouchableWithoutFeedback onPress={this._goCreateEducation.bind(this)}>
                        <View style={styles.btnCreate}>
                            <Image source={require('../../assets/images/education.png')}
                                style={styles.imgEducation}
                                resizeMode="contain"
                            />
                            <View style={[styles.inRow, styles.viewTextCreate]}>
                                <Icon name='plus-circle'
                                    type='material-community'
                                    color='#EDEFEF'
                                    size={scale(20)} />
                                <StandardText regular title style={{ marginLeft: scale(3), color: '#EDEFEF' }}>교육기관등록</StandardText>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                }
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

export default connect(mapStateToProps, bindAction)(Education);