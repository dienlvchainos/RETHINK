import { scale } from '../../utils/scalingUtils';
import { mainColor } from '../../utils/styleUtils';
import { Fonts, sizeStandard, buttonColor } from '../../utils/styleUtils';

export default styles = {
    container: {
        flex: 1,
        backgroundColor: mainColor.bg

    },
    content: {
        flex: 1,
        paddingHorizontal: scale(sizeStandard.paddingContent),
        alignItems: 'center'
    },
    form: {
        flex: 2,
        justifyContent: 'flex-end'
    },
    btnView: {
        flex: 3
    },
    inform: {
        flex: 1.3,
        justifyContent: 'center',
        alignItems: 'center'
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    btn: {
        flex: 4
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
    alignCenter: {
        
    }
}