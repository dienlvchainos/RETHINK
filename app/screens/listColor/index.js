import React from 'react'
import { TouchableWithoutFeedback, View, Keyboard } from 'react-native'
import BaseScreen from '../baseScreen'
import { connect } from 'react-redux';
import styles from './styles';
import Header from "../../components/header";
import CustomInput from "../../components/customInput";
import StandardText from '../../components/standardText';
import SimpleButton from '../../components/simpleButton';
import { buttonColor, mainColor } from "../../utils/styleUtils";
import { scale } from '../../utils/scalingUtils';

class ListColor extends BaseScreen {

    constructor(props) {
        super(props)
        this.state = {
            selected: props.navigation.state.params.colorSelected || null
        }
    }

    colors = ['#B93B50', '#E36179', '#FE90A9', '#FED6DE', '#FFECF0',
        '#AF5030', '#E0744E', '#FB9A7A', '#FEDBC8', '#FFEFE0',
        '#A7741B', '#DAA22B', '#F5D065', '#F9EEAC', '#FCF9D0',
        '#167263', '#26AA85', '#69D4A6', '#CDF4D5', '#EBFAE2',
        '#333FA5', '#4E6CE0', '#7FA9FD', '#CDE2FF', '#E8F4FF',
        '#A485C9', '#8D4DE2', '#BB8EF5', '#E3D1F9', '#F7EAFD',
        '#5D6067', '#767D85', '#A9AEB2', '#D9DBDA', '#EFEFEF']

    _renderItem() {
        return this.colors.map((item) => {
            return <TouchableWithoutFeedback key={item} onPress={this._selectColor.bind(this, item)}>
                <View style={[styles.item, { backgroundColor: item }]}>
                    {this.state.selected == item && <View style={styles.inItem} />}
                </View>
            </TouchableWithoutFeedback>
        })
    }

    _selectColor(selected) {
        this.setState({ selected });
    }

    _backToSelect() {
        let { selected } = this.state;
        this.props.navigation.state.params._selectedColor(selected ? selected : '#000');
        this.props.navigation.goBack();
    }

    _applyColor() {
        this._backToSelect();
    }

    componentDidMount() {

    }

    render() {
        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <View style={styles.container}>
                    <Header
                        rightButtonText="확인"
                        rightButtonOnpress={this._applyColor.bind(this)}
                        screenProps={this.props}
                    >색상</Header>
                    <View style={styles.content}>
                        {this._renderItem()}
                    </View>
                </View>
            </TouchableWithoutFeedback>
        )
    }

}

export default ListColor;