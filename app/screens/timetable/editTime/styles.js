import { Dimensions } from 'react-native';
const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;
import { scale } from '../../../utils/scalingUtils';
import { mainColor } from '../../../utils/styleUtils';
import { Fonts, sizeStandard, buttonColor } from '../../../utils/styleUtils';

export default styles = {
    container: {
        flex: 1,
        backgroundColor: mainColor.bg,
        // paddingVertical: scale(sizeStandard.paddingContent)
    },
    content: {
        flex: 5,
        paddingBottom: scale(60),
        // paddingHorizontal: scale(sizeStandard.paddingContent)
    },
    headerList: {
        flexDirection: 'row',
        marginStart: scale(sizeStandard.paddingContent),
        marginEnd: scale(sizeStandard.paddingContent),
        alignItems: 'flex-end',
        borderBottomWidth: scale(1),
        borderColor: buttonColor.bgInactive,
        marginTop: scale(22),
        marginBottom: scale(22)
    },
    form: {
        paddingHorizontal: scale(sizeStandard.paddingContent - 7),
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    itemForm: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginStart: scale(7),
        marginEnd: scale(7)
    },
    inputForm: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-end',
        textAlign: 'center',
        padding: 0,
        height: scale(35),
        marginTop: scale(3),
        borderWidth: scale(1),
        borderColor: buttonColor.border,
        borderRadius: scale(3)
    },
    btnApply: {
        backgroundColor: buttonColor.bgActive,
        borderWidth: 0,
    },
    textApply: {
        ...Fonts.NanumBarunGothic_Bold,
        fontSize: scale(14)
    },
    listTime: {
        marginTop: scale(26),
        justifyContent: 'center',
        alignItems: 'center'
    },
    textHour: {
        padding: scale(6),
        backgroundColor: buttonColor.bgInactive,
        borderRadius: scale(2)
    },
    itemItem: {
        width: scale(168),
        height: scale(25),
        marginBottom: scale(14),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    listDayOfWeek: {
        paddingHorizontal: scale(sizeStandard.paddingContent),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    itemDayOfWeek: {
        width: scale(40),
        height: scale(40),
        borderRadius: scale(40/2),
        borderWidth: scale(1),
        borderColor: buttonColor.border,
        // marginStart: scale(5),
        // marginEnd: scale(5),
        justifyContent: 'center',
        alignItems: 'center'
    },
    selectedDayOfWeek: {
        backgroundColor: buttonColor.bgInactive,
        borderWidth: 0
    }
}