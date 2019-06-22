import { Dimensions } from 'react-native';
const height = Dimensions.get('window').height;
import { scale } from '../../utils/scalingUtils';
import { mainColor, Fonts } from '../../utils/styleUtils';

export default {
    container: {
        width: '100%',
        height: height / 11,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: mainColor.headerPopup,
        paddingLeft: 0,
        borderBottomWidth: scale(1),
        borderColor: mainColor.headerBorder,
    },
    btnBack: {
        width: scale(60),
        height: '100%',
        position: 'absolute',
        left: 0,
        bottom: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        fontSize: scale(16),
        color: mainColor.text,
        ...Fonts.NanumBarunGothic_Bold,
        textAlign: 'center'
    },
    btnRightIcon: {
        marginLeft: 0,
        position: 'absolute',
        right: 0,
        // bottom: 0
    }
}