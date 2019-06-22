
import React from 'react'
import { View } from 'react-native'
import styles from './styles';
import StandardText from '../../../components/standardText';
import UnderlineText from '../../../components/underlineText';
import SimpleButton from '../../../components/simpleButton';
import CustomRadioGroup from '../../../components/customRadioGroup';
import { buttonColor } from "../../../utils/styleUtils";

class PopupSelectChildSchedule extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            childSelected: null
        }
    }

    _doSelectChild(childSelectedId) {
        this.setState({ childSelected: childSelectedId });
    }

    _doAccept() {
        this.props.onAccept(this.state.childSelected);
    }

    _doCancel() {
        this.props.onCancel();
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.pasteContent}>
                    <View style={styles.titlePaste}>
                        <StandardText title>자녀를 하나 선택하여 일정을 만드십시오</StandardText>
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
                        onPress={this._doAccept.bind(this)}
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

export default PopupSelectChildSchedule