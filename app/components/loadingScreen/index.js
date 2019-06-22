import React from 'react'
import { View, ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import StandardText from "../standardText";
import styles from "./styles";
import { mainColor } from '../../utils/styleUtils';

export default class LoadingScreen extends React.PureComponent {

    render() {
        const { style, title, color } = this.props;
        return (
            <View style={[styles.container, style]} >
                <View style={styles.content}>
                    {!!title ? <StandardText small>{title}</StandardText>
                        : <StandardText small>{"진행 중..."}</StandardText>}
                    <ActivityIndicator size="small" color={color} />
                </View>
            </View>
        )
    }
}

LoadingScreen.propTypes = {
    color: PropTypes.string,
    title: PropTypes.string,
    style: PropTypes.object
}

LoadingScreen.defaultProps = {
    style: {},
    color: mainColor.main
}