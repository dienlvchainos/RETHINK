import React from 'react'
import { View, Image, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types'
import { CheckBox } from 'react-native-elements'
import StandardText from '../standardText';
import { mainColor } from '../../utils/styleUtils';
import { scale } from '../../utils/scalingUtils';
import styles from "./styles";
import constants from '../../constants';

export default class CustomRadioGroup extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            data: props.data,
            value: props.value
        }
    }

    static propTypes = {
        data: PropTypes.array,
        onSelect: PropTypes.func,
        style: PropTypes.object,
        itemStyle: PropTypes.object,
        textStyle: PropTypes.object,
        value: PropTypes.any
    }

    _selectRelation(item) {
        let data = this.state.data;
        let relation = data.find((_data) => _data.id == item.id);
        data.forEach((_data) => _data.checked = false);
        relation.checked = true;
        this.setState({ data });
        this.props.onSelect(item.value);
    }

    _renderContent = () => {
        let data = this.state.data;
        return data.map((item, index) => {
            return <TouchableOpacity key={index} onPress={() => this._selectRelation(item)}>
                <View style={[styles.item, this.props.itemStyle]}>
                    <TouchableOpacity style={styles.radio} onPress={() => this._selectRelation(item)}>
                        {item.checked && <View style={styles.dot}></View>}
                    </TouchableOpacity>
                    <StandardText normal style={Object.assign({ fontSize: scale(16), marginLeft: scale(10) }, this.props.textStyle)}>
                        {item.label}
                        {item.note ? <StandardText style={{ fontSize: scale(10) }}> ( {item.note} )</StandardText> : null}
                    </StandardText>
                </View>
            </TouchableOpacity>
        })
    }

    componentDidMount() {
        if (this.props.value) {
            let { data } = this.state;
            data.forEach((_data) => {
                if (_data.value == this.props.value) {
                    _data.checked = true
                } else _data.checked = false;
            });
            this.setState({ data });
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps && nextProps.value != this.props.value) {
            let { data } = this.state;
            data.forEach((_data) => {
                if (_data.value == nextProps.value) _data.checked = true
            });
            this.setState({ data });
        }
    }

    render() {
        const { style } = this.props;
        return (
            <View style={[styles.container, style]}>
                {this._renderContent()}
            </View>
        )
    }
}