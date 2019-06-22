import { Dimensions } from 'react-native';
const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;
import { mainColor, Fonts, sizeStandard, buttonColor } from '../../../utils/styleUtils';
import { scale } from '../../../utils/scalingUtils';

export default {
    container: {
        flex: 1
    },
    content: {
        flex: 3,
        justifyContent: 'flex-start',
        paddingTop: scale(10),
        paddingHorizontal: scale(sizeStandard.paddingContent * 2)
    },
    modal: {
        height: scale(200),
        width: width - sizeStandard.paddingContent * 2,
        borderRadius: scale(5),
        overflow: 'hidden'
    },
    containerModal: {
        flex: 1
    },
    header: {
        backgroundColor: buttonColor.bgInactive,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    icon: {
        width: scale(17),
        height: scale(20.3),
        marginRight: scale(5)
    },
    itemStyle: {
        height: scale(35),
        marginStart: scale(sizeStandard.paddingContent / 2),
        marginEnd: scale(sizeStandard.paddingContent / 2)
    },
    repeatAction: {
        flex: 1.5,
        flexDirection: 'row',
        borderTopWidth: scale(1),
        borderColor: buttonColor.border
    },
    btnModal: {
        flex: 1,
        borderRadius: 0,
        height: null,
    },
    btnLeftModal: {
        flex: 1,
        borderRightWidth: scale(1),
        borderColor: buttonColor.border,
        borderRadius: 0,
        height: null,
    },
}