import React from 'react'
import { View, FlatList } from 'react-native';
import PropTypes from 'prop-types';
import StandardText from "../standardText";
import styles from "./styles";
import { mainColor, buttonColor } from '../../utils/styleUtils';
import { _formatPercent, _asyncForEach } from '../../helpers';

export default class StackBarChart extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            __totalFee: 0
        }
    }

    _renderRatioData() {
        return
    }

    _renderItemData({ item }) {
        if (this.props.data[item]) {
            let _ratio = this.props.data[item].fee > 0 ? _formatPercent((this.props.data[item].fee / this.state.__totalFee) * 100) : 1;
            let _bg = this.props.data[item].fill;
            return <View style={[styles.viewItem, { width: _ratio }, { backgroundColor: _bg }]}>

            </View>
        } else return null;
    }

    async componentDidMount() {
        let __totalFee = this.state.__totalFee;
        await _asyncForEach(Object.keys(this.props.data), async (_k) => {
            __totalFee += this.props.data[_k].fee;
        })
        this.setState({ __totalFee })
    }

    render() {
        const { containerStyle, height } = this.props;
        if (!this.props.data || this.state.__totalFee == 0) {
            return null;
        }
        return (
            <View style={[styles.container, containerStyle, { height }]} >
                <View style={styles.content}>
                    {/* {this._renderRatioData.bind(this)} */}
                    <FlatList
                        horizontal
                        data={Object.keys(this.props.data)}
                        style={{ backgroundColor: buttonColor.bgWhite }}
                        keyExtractor={(item, index) => String(index)}
                        renderItem={this._renderItemData.bind(this)}
                    />
                </View>
            </View>
        )
    }
}

StackBarChart.propTypes = {
    containerStyle: PropTypes.object,
    data: PropTypes.object
}

StackBarChart.defaultProps = {
    containerStyle: {}
}