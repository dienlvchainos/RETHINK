import React from 'react'
import { TouchableWithoutFeedback, View } from 'react-native';
import PropTypes from 'prop-types'
import { Icon } from 'react-native-elements';
import { buttonColor, mainColor } from "../../utils/styleUtils";
import { scale } from '../../utils/scalingUtils';
import ModalDropdown from 'react-native-modal-dropdown';
import StandardText from '../standardText';
import styles from "./styles";

export default class CustomDropdown extends React.PureComponent {
    static propTypes = {
        data: PropTypes.array,
        style: PropTypes.object,
        value: PropTypes.object,
        dropdownStyle: PropTypes.object
    }

    constructor(props) {
        super(props)
        this.state = {
            indexSelected: props.data.map((d) => d.id).indexOf(props.value.id)
        }
    }

    _openPicker() {
        this._pickerOption.show();
    }

    _selectOption(indexSelected) {
        const optionSelected = this.props.data[indexSelected];
        this.props.onSelect(optionSelected);
        this.setState({ indexSelected });
        this._pickerOption.hide();
    }

    _renderButtonText(rowData) {
        const { icon, title } = rowData;
        return ' ';
    }

    /**
     * item: { id: id, title: string }
     */
    _renderRowPicker = (item, index) => {
        return <View style={[styles.itemPicker, { backgroundColor: this.state.indexSelected == index ? buttonColor.bgInactive : '#FFF'}]}>
            <StandardText bold={this.state.indexSelected == index}>{item.title}</StandardText>
        </View>
    }

    render() {
        let currentIndex = this.state.indexSelected || 0;
        let optionSelected = this.props.value || this.props.data[0];
        return (
            <View style={[styles.container, this.props.style]}>
                <TouchableWithoutFeedback onPress={this._openPicker.bind(this)}>
                    <View style={styles.picker}>
                        <View style={{ flex: 1 }}>
                            <StandardText style={{textAlign: 'center'}}>{optionSelected.title}</StandardText>
                        </View>
                        <View style={{ position: 'absolute', right: 0 }}>
                            <Icon name='menu-down'
                                type='material-community'
                                color='#000'
                                size={scale(20)} />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
                <View style={{ position: 'absolute', height: scale(100), left: scale(15) }}>
                    <ModalDropdown
                        ref={ref => this._pickerOption = ref}
                        dropdownStyle={[styles.pickerContainer, this.props.dropdownStyle]}
                        options={this.props.data}
                        renderRow={this._renderRowPicker.bind(this)}
                        renderButtonText={(rowData) => this._renderButtonText(rowData)}
                        defaultValue=""
                        defaultIndex={Number(currentIndex)}
                        onSelect={this._selectOption.bind(this)}
                    />
                </View>
            </View>
        );
    }
}