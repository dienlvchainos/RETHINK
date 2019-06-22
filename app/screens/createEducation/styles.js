import { Dimensions } from 'react-native';
const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;
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
        paddingHorizontal: scale(sizeStandard.paddingContent)
    },
    form: {
        flex: 6
    },
    btn: {
        flex: 4,
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
    itemEducation: {
        width: '100%',
        height: scale(40),
        paddingHorizontal: scale(sizeStandard.paddingContent),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    contentPopup: {
        height: height/2.5
    },
    btnSelectEducation: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    pickerContainer: {
        marginTop: scale(60),
        width: width - scale(30),
        borderWidth: 0,
        borderRadius: scale(5),
        height: scale(311),
        elevation: 5
    },
}