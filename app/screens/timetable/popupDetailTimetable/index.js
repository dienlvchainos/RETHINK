
import React from 'react'
import { TouchableWithoutFeedback, View, Switch } from 'react-native'
import styles from './styles';
import StandardText from '../../../components/standardText';
import SimpleButton from '../../../components/simpleButton';
import { buttonColor } from "../../../utils/styleUtils";
import { _formatMoney } from '../../../helpers';

export default class PopupDetailTimetable extends React.Component {

    constructor(props) {
        super(props);
    }

    _onSwitch() {

    }

    _doCopy() {
        this.props.onCopy(this.props.schedule);
    }

    _doDelete() {
        this.props.onDelete(this.props.schedule);
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.copyInfo}>
                    <View style={styles.inRow}>
                        <View style={styles.itemInRow}><StandardText bold>기관명</StandardText></View>
                        <View style={styles.itemInRow}><StandardText style={{}}>{this.props.schedule.title}</StandardText></View>
                    </View>
                    <View style={styles.inRow}>
                        <View style={styles.itemInRow}><StandardText bold>과목</StandardText></View>
                        <View style={styles.itemInRow}><StandardText style={{}}>{this.props.schedule.subject}</StandardText></View>
                    </View>
                    <View style={styles.inRow}>
                        <View style={styles.itemInRow}><StandardText bold>위치</StandardText></View>
                        <View style={styles.itemInRow}><StandardText style={{}}>{this.props.schedule.location}</StandardText></View>
                    </View>
                    <View style={styles.inRow}>
                        <View style={styles.itemInRow}><StandardText bold>월 비용</StandardText></View>
                        <View style={styles.itemInRow}><StandardText style={{}}>{_formatMoney(this.props.schedule.fee)} 원</StandardText></View>
                    </View>
                    <View style={styles.inRow}>
                        <View style={styles.itemInRow}><StandardText bold>납입일</StandardText></View>
                        <View style={styles.itemInRow}>
                        <Switch onValueChange={this._onSwitch.bind(this)} value={this.props.schedule.notification == 1 ? true : false} />
                        </View>
                    </View>
                </View>
                <View style={styles.copyAction}>
                    <SimpleButton
                        onPress={this._doCopy.bind(this)}
                        propComponent={{
                            underlayColor: buttonColor.underlay
                        }}
                        style={styles.btnLeftModal}
                        textStyle={{}}>복사</SimpleButton>
                    <SimpleButton
                        onPress={this._doDelete.bind(this)}
                        propComponent={{
                            underlayColor: buttonColor.underlay
                        }}
                        style={styles.btnModal}
                        textStyle={{}}>삭제</SimpleButton>
                </View>
            </View>
        );
    }
}