import React from 'react'
import { TouchableWithoutFeedback, View, ScrollView } from 'react-native';
import PropTypes from 'prop-types'
import { Button } from 'react-native-elements';
import ModalDropdown from 'react-native-modal-dropdown';
import StandardText from '../../../components/standardText';
import styles from "./styles";
import { scale } from '../../../utils/scalingUtils';
import { Fonts, sizeStandard } from '../../../utils/styleUtils';
import UnderlineText from '../../../components/underlineText';
export default class Header extends React.Component {

    constructor(props) {
        super(props);;
        this.state = {
            _list: [],
            childSelected: props.childSelected
        }
    }

    _backScreen() {
        if (this.props.onBack) {
            return this.props.onBack();
        }
        const { goBack } = this.props.screenProps.navigation;
        goBack(null);
    }

    _doRightAction() {
        return this.props.rightAction();
    }

    _doChangeChild() {
        this._pickerChild.show();
    }

    _renderRowPicker = (item, index) => {
        return <TouchableWithoutFeedback onPress={() => this._selectChild(item)}>
            <View style={styles.itemChildPicker}>
                <StandardText style={{color: item.color}}>{Number(index) + 1}. {item.name}</StandardText>
            </View>
        </TouchableWithoutFeedback>
    }

    _selectChild(indexChild) {
        let childSelected = this.state._list[indexChild];
        this.props.onChildSelect(childSelected);
        this._pickerChild.hide();
    }

    _renderButtonText(rowData) {
        const { icon, title } = rowData;
        return ' ';
    }

    _renderChildHeader() {
        if (this.props.childSelected) {
            if (this.props.childSelected.id != -1) {
                return <StandardText title style={{ textAlign: 'center', color: this.props.childSelected.color }}>{this.props.childSelected.name}</StandardText>
            } else {
                if (this.props.childSelected.id == -1 && this.props.childs.length > 2) {
                    return <StandardText title style={{ textAlign: 'center', color: this.props.childSelected.color }}>{this.props.childSelected.name}</StandardText>
                } else {
                    if (this.props.childs.length > 0) {
                        return <View style={styles.inRowChild}>
                            <StandardText title style={{ textAlign: 'center', color: this.props.childs[0].color }}>{this.props.childs[0].name}</StandardText>
                            {!!this.props.childs[1] && <StandardText title style={{ textAlign: 'center', color: this.props.childs[1].color }}>{this.props.childs[1].name}</StandardText>}
                        </View>
                    } else {
                        return <StandardText title style={{ textAlign: 'center', color: this.props.childSelected.color }}>{this.props.childSelected.name}</StandardText>
                    }
                }
            }
        }
    }

    componentDidMount() {
        let _list = this.props.childs;
        _list = _list.concat([{
            id: -1,
            name: '같이보기'
        }]);
        this.setState({ _list })
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.viewBack}>
                    <Button
                        containerViewStyle={styles.btnBack}
                        transparent
                        rightIcon={{ name: 'ios-arrow-round-back', type: 'ionicon', color: '#000', size: 40 }}
                        onPress={this._backScreen.bind(this)} />
                    {!this.props.title && <StandardText large style={{ marginLeft: scale(5), ...Fonts.NanumBarunGothic_Regular }}>시간표</StandardText>}
                </View>
                {this.props.childSelected
                    ? <TouchableWithoutFeedback onPress={this._doChangeChild.bind(this)}>
                        <View style={{ flex: 1 }}>
                            {this._renderChildHeader()}
                        </View>
                    </TouchableWithoutFeedback>
                    : <StandardText large style={{ marginLeft: scale(5), ...Fonts.NanumBarunGothic_Regular }}>{this.props.title}</StandardText>}
                <View style={{ position: 'absolute', left: '27%' }}>
                    <ModalDropdown
                        ref={ref => this._pickerChild = ref}
                        dropdownStyle={[styles.pickerContainer, { height: scale(this.state._list.length * 40) }]}
                        options={this.state._list}
                        renderRow={this._renderRowPicker.bind(this)}
                        renderButtonText={(rowData) => this._renderButtonText(rowData)}
                        defaultValue=""
                        onSelect={this._selectChild.bind(this)}
                    />
                </View>
                <View style={styles.viewRight}>
                    <UnderlineText style={{ marginEnd: scale(sizeStandard.paddingContent) }} onPress={this._doRightAction.bind(this)}>
                        <StandardText large style={{ ...Fonts.NanumBarunGothic_Regular }}>{this.props.rightButtonText}</StandardText>
                    </UnderlineText>
                </View>
            </View>
        )
    }
}

Header.propTypes = {
    rightButtonText: PropTypes.string,
    rightAction: PropTypes.func,
    childs: PropTypes.array
}

Header.defaultProps = {
    childs: []
}