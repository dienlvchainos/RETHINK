import { scale } from '../../utils/scalingUtils';
import { mainColor } from '../../utils/styleUtils';
import { Fonts, sizeStandard, buttonColor } from '../../utils/styleUtils';

export default styles = {
    container: {
        flex: 1,
        backgroundColor: mainColor.bg
    },
    img: {
        flex: 2,
        width: '100%',
        alignSelf: 'stretch',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: scale(40)
    },
    slide: {
        flex: 4
    },
    about: {
        flex: 1,
        flexDirection: 'row'
    },
    suggest: {
        flex: 3,
        justifyContent: 'center',
        paddingHorizontal: scale(12)
    },
    policy: {
        flex: 1,
        flexDirection: 'row'
    },
    version: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: scale(12),
        justifyContent: 'space-between',
    },
    slideWrapper: {

    },
    slideItem: {
        flex: 1,
        width: '100%'
    },
    slideItem1: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#97CAE5'
    },
    btnAbout: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#EDEFEF',
    },
    btnAbout1: {
        borderBottomWidth: scale(1),
        borderColor: mainColor.seperateColor
    },
    iconBtn: {
        width: scale(24),
        height: scale(25),
        marginRight: scale(5)
    },
    suggestApp: {
        marginTop: scale(5),
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    suggestItem: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    iconSuggestApp: {
        width: scale(50),
        height: scale(50)
    },
    textVersion: {
        ...Fonts.NanumBarunGothic_Regular,
        fontSize: scale(12),
        color: '#000'
    }
}