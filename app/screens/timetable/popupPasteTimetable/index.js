
import React from 'react'
import { View } from 'react-native'
import styles from './styles';
import StandardText from '../../../components/standardText';
import UnderlineText from '../../../components/underlineText';
import SimpleButton from '../../../components/simpleButton';
import CustomRadioGroup from '../../../components/customRadioGroup';
import { buttonColor } from "../../../utils/styleUtils";

class PopupPasteTimetable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            childSelected: props.schedule.child_id
        }
    }

    _doSelectChild(childSelectedId) {
        this.setState({ childSelected: childSelectedId });
    }

    _doPaste() {
        let schedule = this.props.schedule;
        schedule.child_id = this.state.childSelected;
        this.props.onPaste(this.props.schedule);
    }

    _doCancel() {
        this.props.onCancel();
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.pasteContent}>
                    <View style={styles.titlePaste}>
                        <StandardText large>에 ... {this.props.schedule.title} 를 복사하기</StandardText>
                    </View>
                    <View style={styles.pickChildToPaste}>
                        <CustomRadioGroup
                            style={{ alignItems: 'flex-start' }}
                            itemStyle={styles.pasteItemChild}
                            data={this.props.childs}
                            value={this.state.childSelected}
                            onSelect={this._doSelectChild.bind(this)} />
                    </View>

                </View>
                <View style={styles.copyAction}>
                    <SimpleButton
                        onPress={this._doPaste.bind(this)}
                        propComponent={{
                            underlayColor: buttonColor.underlay
                        }}
                        style={styles.btnLeftModal}
                        textStyle={{}}>확인</SimpleButton>
                    <SimpleButton
                        onPress={this._doCancel.bind(this)}
                        propComponent={{
                            underlayColor: buttonColor.underlay
                        }}
                        style={styles.btnModal}
                        textStyle={{}}>취소</SimpleButton>
                </View>
            </View>
        );
    }
}

export default PopupPasteTimetable