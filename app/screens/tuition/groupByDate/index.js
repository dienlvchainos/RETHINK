import React from 'react'
import { TouchableWithoutFeedback, View } from 'react-native'
import styles from './styles';
import { scale } from '../../../utils/scalingUtils';
import StandardText from '../../../components/standardText';
import moment from 'moment';
import { _findInArray, _totalInArray, _formatMoney, _asyncForEach, _shortText } from '../../../helpers';

class GroupByDate extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {

        }
    }

    _renderItem() {
        return Object.keys(this.props.data).map((itemKey) => {
            return <View key={itemKey} style={styles.item}>
                <StandardText>{_shortText(itemKey, 35)}</StandardText>
                <StandardText bold>{this.props.data[itemKey] ? _formatMoney(this.props.data[itemKey][0].fee || 0) : 0}원</StandardText>
            </View>
        })
    }

    componentDidMount() {

    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <StandardText bold>{this.props.title}</StandardText>
                    <StandardText bold>{_formatMoney(this.props.total)}원</StandardText>
                </View>
                {this._renderItem()}
            </View>
        )
    }
}

export default GroupByDate;