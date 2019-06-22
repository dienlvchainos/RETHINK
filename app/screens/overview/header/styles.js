import { Dimensions } from 'react-native';
const height = Dimensions.get('window').height;
import { scale } from '../../../utils/scalingUtils';
import { mainColor, buttonColor, Fonts } from '../../../utils/styleUtils';

export default {
    container: {
        height: height/11,
        backgroundColor: mainColor.bg,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingRight: scale(10),
        borderBottomWidth: scale(1),
        borderColor: mainColor.headerBorder
    },
    btn: {
        marginLeft: 0
    },
    iconList: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    btnIcon: {
        width: scale(32),
        height: scale(32),
        borderWidth: scale(1),
        borderRadius: scale(16),
        // backgroundColor: '#FABC05',
        marginStart: scale(5),
        marginEnd: scale(5),
        justifyContent: 'center',
        alignItems: 'center'
    },
    icon: {
        width: scale(32),
        height: scale(32),
        borderRadius: scale(16)
    },
    iconAction: {
        marginStart: scale(5),
        marginEnd: scale(5),
        width: scale(34.8),
        height: scale(32)
    }
}