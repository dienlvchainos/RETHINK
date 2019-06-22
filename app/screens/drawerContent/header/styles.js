import { Dimensions } from 'react-native';
const height = Dimensions.get('window').height;
import { scale } from '../../../utils/scalingUtils';
import { mainColor, buttonColor, Fonts } from '../../../utils/styleUtils';

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
        borderColor: mainColor.headerBorder
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
    info: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    avatar: {
        width: scale(27),
        height: scale(27),
        borderWidth: scale(1),
        borderRadius: scale(13.5),
        backgroundColor: '#FABC05',
        marginStart: scale(5),
        marginEnd: scale(5),
        justifyContent: 'center',
        alignItems: 'center'
    },
    icon: {
        width: scale(27),
        height: scale(27),
        borderRadius: scale(27 / 2)
    },
    btnRightIcon: {
        marginRight: 0,
        marginLeft: 0,
        position: 'absolute',
        right: 0,
        bottom: 0
    }
}