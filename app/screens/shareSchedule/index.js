import React from 'react'
import { TouchableWithoutFeedback, View, Linking, Image } from 'react-native'
import { Icon } from 'react-native-elements';
import { CheckBox } from 'react-native-elements'
import BaseScreen from '../baseScreen'
import Share from 'react-native-share';
import { connect } from 'react-redux';
import { scale } from '../../utils/scalingUtils';
import styles from './styles';
import { mainColor } from '../../utils/styleUtils';
import sf from '../../libs/serviceFactory';
import StandardText from '../../components/standardText';
import UnderlineText from '../../components/underlineText';
import Header from "../../components/header";
import noticeUtils from '../../utils/noticeUtils';

class ShareSchedule extends BaseScreen {

    constructor(props) {
        super(props)
        this.state = {
            isHandling: false,
            childChecked: []
        }
    }

    simpleShare(_url) {
        let options = {
            // url: _url,
            message: _url,
            title: '초대하기'
        }
        Share.open(options)
            .then((res) => {})
            .catch((err) => { err && console.log(err); });
    }

    _doShare(_permission) {
        let _childChecked = this.state.childChecked.filter(c => c.selected == true).map(c => c.id).join('-');
        if(_childChecked) {
            let userId = this.props.user.data.id;
            let userToken = this.props.user.apiKey;
            let _url = `http://45.76.55.157/deep-linking/timetable?c=${_childChecked}&p=${_permission}&o=${userId}`;
            this.simpleShare(_url, _permission, userToken)
        } else noticeUtils.inform(noticeUtils.message.plsSelectChild)
    }

    _selectChild(childId) {
        let { childChecked } = this.state;
        let _childIndex = childChecked.map(c => c.id).indexOf(childId);
        childChecked[_childIndex].selected = !childChecked[_childIndex].selected;
        this.setState({ childChecked })
    }

    _renderChild() {
        return this.state.childChecked.map((c) => {
            return <CheckBox
                key={c.id}
                containerStyle={{ padding: 0, marginLeft: scale(10), borderWidth: 0, backgroundColor: 'transparent' }}
                wrapperStyle={{ borderColor: '#DDE5F6' }}
                checked={c.selected}
                uncheckedColor="#DDE5F6"
                checkedColor={mainColor.main}
                title={c.name}
                textStyle={styles.textCheckbox}
                onPress={this._selectChild.bind(this, c.id)}
            />
        })
    }

    componentDidMount() {
        let childChecked = this.props.child.list.map((c) => {
            return {
                id: c.id,
                name: c.name,
                selected: false
            }
        });
        this.setState({ childChecked });
    }

    render() {
        return (
            <View style={styles.container}>
                <Header screenProps={this.props}>초대하기</Header>
                <View style={styles.headerList}>
                    <UnderlineText style={{}}><StandardText>보기만 해요</StandardText></UnderlineText>
                </View>
                <TouchableWithoutFeedback onPress={this._doShare.bind(this, 'view')}>
                    <View style={styles.optionShare}>
                        <View style={styles.inRow}>
                            <Icon name='circle'
                                type='material-community'
                                color='#FABC05'
                                size={scale(10)} />
                            <StandardText title regular style={{ marginLeft: scale(3) }}>초대하기</StandardText>
                        </View>
                        <Image source={require('../../assets/icons/arrowRightIcon.png')}
                            style={styles.icon}
                            resizeMode="contain" />
                    </View>
                </TouchableWithoutFeedback>
                <View style={styles.headerList}>
                    <UnderlineText style={{}}><StandardText>보기 - 수정도 해요</StandardText></UnderlineText>
                </View>
                <TouchableWithoutFeedback onPress={this._doShare.bind(this, 'master')}>
                    <View style={styles.optionShare}>
                        <View style={styles.inRow}>
                            <Icon name='circle'
                                type='material-community'
                                color='#FABC05'
                                size={scale(10)} />
                            <StandardText title regular style={{ marginLeft: scale(3) }}>초대하기</StandardText>
                        </View>
                        <Image source={require('../../assets/icons/arrowRightIcon.png')}
                            style={styles.icon}
                            resizeMode="contain" />
                    </View>
                </TouchableWithoutFeedback>
                <View style={styles.viewChild}>
                    <UnderlineText style={{ alignSelf: 'center', marginBottom: scale(20) }}><StandardText>자녀 일정을 공유하고 있어요</StandardText></UnderlineText>
                    {this._renderChild()}
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
    user: state.user,
    child: state.child
});

export default connect(mapStateToProps, bindAction)(ShareSchedule);