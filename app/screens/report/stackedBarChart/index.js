import React, { PureComponent } from 'react';
import { Animated } from 'react-native';
import styles from './styles';
import StandardText from '../../../components/standardText';

export default class StackedBarChart extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {

        }
    }

    componentDidMount() {
        this._total = Object.keys(this.props.data).reduce((acc, curr) => {
            return acc + this.props.data[curr].value
        }, 0)
    }

    _calWidth(value) {
        return `${((value / this._total) * 100).toFixed(2)}%`
    }

    render() {
        return (
            <Animated.View style={styles.fullBar}>
                {Object.keys(this.props.data).map((d) => {
                    return <Animated.View key={d} style={[styles.bar, { width: this._calWidth(this.props.data[d].value), backgroundColor: this.props.data[d].svg.fill }]}>
                        <StandardText bold style={styles.text}>{this._calWidth(this.props.data[d].value)}</StandardText>
                    </Animated.View>
                })}
            </Animated.View>
        )
    }
}