import { Dimensions } from 'react-native';
const height = Dimensions.get('window').height;
import { scale } from '../../../utils/scalingUtils';
import { mainColor, buttonColor, Fonts } from '../../../utils/styleUtils';

export default {
    container: {
        backgroundColor: mainColor.bg,
        height: scale(250),
        borderRadius: scale(10),
        borderWidth: scale(1),
        borderColor: mainColor.popupOutlineBorder,
        overflow: 'hidden'
    },
    header: {
        flex: 1,
        backgroundColor: mainColor.headerPopup,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: scale(2),
        borderColor: mainColor.popupHeaderBorder
    },
    content: {
        flex: 4
    },
    content1: {
        flex: 3,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: scale(20)
    },
    content2: {
        flex: 1.2,
        flexDirection: 'row',
        alignItems: 'flex-end'
    },
    textCheckbox: {
        color: mainColor.text,
        fontSize: scale(14),
        ...Fonts.NanumBarunGothic_Regular
    },
    btn: {
        flex: 1,
        height: '100%',
        borderWidth: scale(1),
        borderColor: buttonColor.border,
        justifyContent: 'center',
        alignItems: 'center'
    },
    row: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        // justifyContent: 'space-between',
        flexWrap: 'wrap'
    }
}