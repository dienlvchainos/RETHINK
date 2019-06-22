import React from 'react'
import { TouchableWithoutFeedback, View, FlatList } from 'react-native';
import PropTypes from 'prop-types'
import { buttonColor, mainColor } from "../../utils/styleUtils";
import { scale } from '../../utils/scalingUtils';
import StandardText from '../standardText';
import styles from "./styles";

export default class SuggestComponent extends React.PureComponent {
    static propTypes = {
        visible: PropTypes.bool,
        data: PropTypes.array,
        itemStyle: PropTypes.object,
        containerStyle: PropTypes.object
    }

    constructor(props) {
        super(props)
        this.state = {

        }
    }

    _openPicker() {
        this._pickerOption.show();
    }

    _selectOption(item) {
        this.props.onSelect(item);
    }

    _renderRowPicker = ({ item }) => {
        return <TouchableWithoutFeedback onPress={this._selectOption.bind(this, item)}>
            <View style={[styles.item, this.props.itemStyle]}>
                {item.address
                    ? <StandardText>{this._shortText(item.address, 28)}</StandardText>
                    : <View style={styles.inRow}>
                        <StandardText>{this._shortText(item.subject)}</StandardText>
                        <StandardText>{this._shortText(item.name)}</StandardText>
                        <StandardText>{this._shortText(item.location)}</StandardText>
                    </View>
                }
            </View>
        </TouchableWithoutFeedback>
    }

    _shortText(_text, _max = 14) {
        if (_text && _text.length >= _max) return _text.substring(0, _max) + '...';
        return _text;
    }

    render() {
        if (this.props.visible) {
            return (
                <View style={[styles.container, this.props.containerStyle]}>
                    <FlatList
                        extraData={this.props}
                        style={styles.listSuggest}
                        data={this.props.data}
                        keyExtractor={(item, index) => String(index)}
                        renderItem={this.props.renderItem ? this.props.renderItem() : this._renderRowPicker.bind(this)}
                    />
                </View>
            );
        } else return null;
    }
}