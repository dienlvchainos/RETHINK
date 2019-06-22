import React from 'react'
import { Text, View } from 'react-native';
import PropTypes from 'prop-types'
import styles from "./styles";
import { Fonts } from '../../utils/styleUtils';

export default class StandardText extends React.Component {

    render() {
        const { title, small, large, style, regular, bold } = this.props;
        const textStyle = large ? styles.largeStyle : title ? styles.titleStyle : small ? styles.smallStyle : styles.normalStyle;
        const fontStyle = bold ? {...Fonts.NanumBarunGothic_Bold } : regular ? {...Fonts.NanumBarunGothic_Regular } : {};
        let mainStyle = [textStyle, fontStyle];
        if(typeof style == 'object') {
            mainStyle.push(style);
        } else mainStyle = mainStyle.concat(style);
        return (
            <Text style={mainStyle}>{this.props.children} </Text>
        )
    }
}

StandardText.propTypes = {
    title: PropTypes.bool,
    normal: PropTypes.bool,
    large: PropTypes.bool,
    small: PropTypes.bool,
    style: PropTypes.any,
    bold: PropTypes.bool,
    regular: PropTypes.bool
}

StandardText.defaultProps = {
    normal: true
}