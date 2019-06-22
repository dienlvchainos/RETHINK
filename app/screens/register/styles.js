import { Dimensions } from 'react-native';
const height = Dimensions.get('window').height;
import { scale } from '../../utils/scalingUtils';
import { mainColor, buttonColor, Fonts, sizeStandard } from '../../utils/styleUtils';

export default {
    container: {
        flex: 1,
        backgroundColor: mainColor.bg
    },
    form: {
        flex: 5.8,
        paddingHorizontal: scale(sizeStandard.paddingContent),
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    more: {
        flex: 1.6,
        paddingHorizontal: scale(sizeStandard.paddingContent),
        justifyContent: 'flex-start',
        paddingBottom: scale(10),
    },
    btn: {
        paddingHorizontal: scale(sizeStandard.paddingContent),
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: scale(60)
    },
    btnActiveStyle: {
        backgroundColor: buttonColor.bgActive,
        borderWidth: 0,
        width: scale(240)
    },
    btnInactiveStyle: {
        width: scale(240),
        backgroundColor: buttonColor.bgInactive
    },
    textActiveStyle: {
        ...Fonts.NanumBarunGothic_Bold
    },
    textInactiveStyle: {

    },
    textSns: {
        fontSize: scale(16),
        color: mainColor.text,
        ...Fonts.NanumBarunGothic_Bold
    },
    listIcon: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: scale(15)
    },
    icon: {
        width: scale(27),
        height: scale(27),
        marginStart: scale(5),
        marginEnd: scale(5)
    },
    title: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        // marginTop: scale(20)
    }
}