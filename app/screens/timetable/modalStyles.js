import { scale } from '../../utils/scalingUtils';
import { mainColor } from '../../utils/styleUtils';
import { Dimensions } from 'react-native';
const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;
import { Fonts, sizeStandard, buttonColor } from '../../utils/styleUtils';

export default styles = {
    modal: {
        height: height / 1.5,
    },
    modalCopy: {
        width: width-sizeStandard.paddingContent*2,
        height: height / 2.3,
        borderRadius: scale(5),
        overflow: 'hidden'
    },
    modalPaste: {
        width: width-sizeStandard.paddingContent*2,
        height: height / 2.6,
        borderRadius: scale(5),
        overflow: 'hidden'
    },
    modalShare: {
        width: scale(240),
        height: scale(94),
        borderRadius: scale(5),
        overflow: 'hidden'
    },
    containderModal: {
        flex: 1,
        backgroundColor: mainColor.bg,
        paddingBottom: scale(10)
    },
    headerModal: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: scale(1),
        borderColor: mainColor.popupOutlineBorder
    },
    contentModal: {
        flex: 7.5,
        paddingHorizontal: scale(17)
    },
    viewTimePicked: {
        flex: .8,
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'flex-end'
    },
    btn: {
        flex: 1.5,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: scale(10)
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
    pickerContainer: {
        // marginTop: scale(80),
        width: width - scale(30),
        borderWidth: 0,
        borderRadius: scale(5),
        height: scale(200),
        elevation: 5
    },
    
}