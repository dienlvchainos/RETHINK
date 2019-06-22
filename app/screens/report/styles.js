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
        // flex: 1,
        // paddingHorizontal: scale(sizeStandard.paddingContent),
        // alignItems: 'center'
    },
    viewPie: {
        width: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    pieChart: {
        flex: 1,
        paddingTop: scale(25)
    },
    colChart: {
        flex: 1,
        paddingTop: scale(25)
    },
    colView: {
        // paddingBottom: scale(20),
        flexDirection: 'row',
        height: scale(400),
        width: '100%'
    },
    viewBar: { height: scale(400), width: scale(width - 45), marginLeft: scale(10) },
    viewInputDate: {
        // height: scale(50),
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
        textAlign: 'center',
        marginRight: scale(2)
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
    colorData: {
        flexDirection: 'row',
        alignItems: 'center',
        // justifyContent: 'center',
        flexWrap: 'wrap',
        paddingHorizontal: scale(sizeStandard.paddingContent)
    },
    itemColor: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: scale(3),
        marginTop: scale(5),
        marginRight: scale(5)
    },
    color: {
        width: scale(11.6),
        height: scale(11.6),
        marginRight: scale(5)
    },
    itemSelectChild: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: sizeStandard.paddingContent + sizeStandard.paddingContent / 2,
        height: scale(45),
        borderBottomWidth: scale(1),
        borderColor: buttonColor.border
    },
    modalSelectChild: {
        width: scale(240),
        height: scale(135),
        borderRadius: scale(5),
        overflow: 'hidden'
    },
    modalPickDate: {
        width: width - (sizeStandard.paddingContent * 2),
        height: scale(220),
        borderRadius: scale(5),
        overflow: 'hidden'
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
    viewInputDateModal: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: buttonColor.bgInactive,
        paddingHorizontal: scale(6)
    },
    inputDateModal: {
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
    viewStackBarChart: {
        width: '100%', paddingHorizontal: scale(sizeStandard.paddingContent)
    },
    barOfMonth: {
        width: '100%'
    },
    containerStackBar: {
        height: scale(42), borderRadius: scale(21),
        marginTop: scale(15), overflow: 'hidden',
        paddingVertical: scale(12),
        paddingHorizontal: scale(8.5),
        borderWidth: scale(1),
        borderColor: buttonColor.border,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    innerStackBar: {
        // height: scale(30),
        width: '100%',
        overflow: 'hidden',
        borderRadius: scale(15),
    },
    viewDatetime: {
        width: '100%',
        height: scale(55),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: buttonColor.bgInactive
    },
    btnDatetime: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: scale(5)
    },
    activeMonth: {
        backgroundColor: mainColor.main,
        width: scale(30),
        height: scale(30),
        borderRadius: scale(15),
        textAlign: 'center',
        textAlignVertical: "center",
    },
    inRowActive: {
        borderBottomWidth: scale(1),
        borderColor: mainColor.main
    },
    inRowInactive: {
        borderBottomWidth: scale(1),
        borderColor: buttonColor.border
    },
}