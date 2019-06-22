import { Dimensions } from 'react-native';
const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;
import { mainColor, Fonts, sizeStandard, buttonColor } from '../../utils/styleUtils';
import { scale } from '../../utils/scalingUtils';

export default {
    container: {
        flex: 1
    },
    content: {
        flex: 3,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: scale(1),
        borderColor: buttonColor.border
    },
    modal: {
        height: scale(200),
        width: width - sizeStandard.paddingContent*2,
        borderRadius: scale(5),
        overflow: 'hidden'
    },
    containerModal: {
        flex: 1
    },
    actions: {
        flex: 1
    },
    btnOk: {
        backgroundColor: buttonColor.bgActive,
        borderWidth: 0,
        borderRadius: 0,
        flex: 1
    },
    textActiveStyle: {
        ...Fonts.NanumBarunGothic_Bold
    },
}