import { scale } from '../../utils/scalingUtils';
import { mainColor } from '../../utils/styleUtils';
import { Dimensions } from 'react-native';
import { Fonts, sizeStandard, buttonColor } from '../../utils/styleUtils';
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default styles = {
    container: {
        flex: 1,
        backgroundColor: mainColor.bg

    },
    content: {
        flex: 1,
        // paddingHorizontal: scale(sizeStandard.paddingContent),
        alignItems: 'center'
    },
    viewDatetime: {
        width: '100%',
        height: scale(55),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: buttonColor.bgInactive
    },
    childTitle: {
        height: scale(120),
        paddingHorizontal: scale(sizeStandard.paddingContent),
        alignItems: 'center',
        justifyContent: 'center'
    },
    infoTuition: {
        width: '100%',
        paddingHorizontal: scale(sizeStandard.paddingContent)
    },
    infoHeaderTuition: {
        width: '100%',
    },
    btnDatetime: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: scale(5)
    },
    itemInfo: {
        height: scale(45),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: scale(1),
        borderColor: buttonColor.border
    },
    itemHeaderTuition: {
        height: scale(45),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: scale(1),
        borderColor: buttonColor.border,
        paddingHorizontal: scale(sizeStandard.paddingContent)
    },
    headerTotal: {
        height: scale(45),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: buttonColor.bgInactive,
        paddingHorizontal: scale(sizeStandard.paddingContent)
    },
    modalSelectChild: {
        width: scale(240),
        height: scale(135),
        borderRadius: scale(5),
        overflow: 'hidden'
    },
    modalPickDate: {
        width: width - (sizeStandard.paddingContent * 2),
        height: scale(270),
        borderRadius: scale(5),
        overflow: 'hidden'
    },
    itemSelectChild: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: sizeStandard.paddingContent + sizeStandard.paddingContent / 2,
        height: scale(45),
        borderBottomWidth: scale(1),
        borderColor: buttonColor.border
    },
    contentFilterTime: {
        flex: 3.5,
        alignItems: 'center'
    },
    actionFilter: {
        flex: 1,
        flexDirection: 'row',
        borderTopWidth: scale(1),
        borderColor: buttonColor.border
    },
    btnLeftModal: {
        flex: 1,
        borderRightWidth: scale(1),
        borderColor: buttonColor.border,
        borderRadius: 0,
        height: null,
    },
    btnModal: {
        flex: 1,
        borderRadius: 0,
        height: null,
    },
    inRow: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: scale(5),
        paddingBottom: scale(5)
    },
    inRowActive: {
        borderBottomWidth: scale(2),
        borderColor: mainColor.main
    },
    inRowInactive: {
        borderBottomWidth: scale(1),
        borderColor: buttonColor.border
    },
    viewInputDate: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: buttonColor.bgInactive,
        paddingHorizontal: scale(6)
    },
    inputDate: {
        borderWidth: scale(1),
        borderColor: buttonColor.border,
        backgroundColor: buttonColor.bgWhite,
        width: scale(50),
        height: scale(30),
        padding: 0,
        textAlign: 'center'
    },
    viewListMonth: {
        flex: 3,
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    itemMonth: {
        width: '25%',
        height: '33%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    viewByDate: {
        width: '100%',
    },
    viewChildByDate: {
        width: '100%',
        height: scale(80),
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    activeMonth: {
        backgroundColor: mainColor.main,
        width: scale(30),
        height: scale(30),
        borderRadius: scale(15),
        textAlign: 'center',
        textAlignVertical: "center",
    },
    viewDatetimePopup: {
        // marginTop: scale(5),
        width: '100%',
        height: scale(50),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: buttonColor.bgInactive
    },
    btnDatetimePopup: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: scale(5)
    }
}