import { Dimensions } from 'react-native';
const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;
import { scale } from '../../utils/scalingUtils';
import { mainColor } from '../../utils/styleUtils';
import { Fonts, sizeStandard, buttonColor } from '../../utils/styleUtils';

export default styles = {
    container: {
        flex: 1,
        backgroundColor: mainColor.bg,
        // paddingVertical: scale(sizeStandard.paddingContent)
    },
    content: {
        flex: 1,
        // paddingBottom: scale(60)
    },
    btnCreate: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginStart: scale(sizeStandard.paddingContent),
        marginEnd: scale(sizeStandard.paddingContent),
        borderWidth: scale(1),
        borderColor: buttonColor.border,
        borderRadius: scale(5),
        backgroundColor: 'transparent'
    },
    itemEducation: {
        width: (width - scale(sizeStandard.paddingContent*2)) / 2,
        height: scale(155),
        marginStart: scale(5),
        marginEnd: scale(5),
        paddingHorizontal: scale(6),
        marginBottom: sizeStandard.paddingContent,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: scale(1),
        borderColor: buttonColor.border,
        borderRadius: scale(5),
        backgroundColor: 'transparent'
    },
    imgEducation: {
        width: scale(84),
        height: scale(84)
    },
    iconEducation: {
        width: scale(23),
        height: scale(23)
    },
    imgEducationCreate: {
        width: scale(42),
        height: scale(42)
    },
    inRow: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    viewTextCreate: {
        marginTop: scale(5)
    },
    headerList: {
        flexDirection: 'row',
        paddingHorizontal: scale(sizeStandard.paddingContent),
        alignItems: 'flex-end',
        borderBottomWidth: scale(1),
        borderColor: buttonColor.bgInactive,
        marginTop: scale(22),
        marginBottom: scale(22)
    },
    list: {
        alignItems: 'center',
        justifyContent: 'center'
    }
}