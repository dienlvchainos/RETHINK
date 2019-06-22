import { scale } from '../../utils/scalingUtils';
import { mainColor, calendarColor } from '../../utils/styleUtils';
import { Dimensions } from 'react-native';
const width = Dimensions.get('window').width;
import { Fonts, sizeStandard, buttonColor } from '../../utils/styleUtils';

export default styles = {
    container: {
        flex: 1,
        backgroundColor: mainColor.bg

    },
    itemTime: {
        width: '100%',
        height: scale(80),
        paddingHorizontal: scale(2),
        justifyContent: 'center',
        alignItems: 'center',
        borderRightWidth: scale(1),
        borderColor: calendarColor.border,
    },
    viewTime: {
        width: width / 8
    },
    itemDayOfWeek: {
        height: scale(50),
        justifyContent: 'center',
        backgroundColor: calendarColor.bgWhite,
        borderBottomWidth: scale(1),
        borderColor: calendarColor.border
    },
    textTime: {
        ...Fonts.NanumBarunGothic_Bold,
        fontSize: scale(10),
        color: '#7C878E',
        textAlign: 'center'
    },
    headerTime: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, .36)',
        flexDirection: 'row',
    },
    marginView: {
        width: width / 8,
        borderBottomWidth: scale(1),
        borderColor: calendarColor.border,
    },
    viewHeader: {
        width: width - width / 8,
        flexDirection: 'row'
    },
    viewEvent: {
        flex: 1,
        // width: width - width / 9,
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    itemEvent: {
        flex: 1,
        // width: '100%',
        height: scale(80),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: scale(2),
        borderRightWidth: scale(1),
        borderTopWidth: scale(1),
        borderBottomWidth: scale(1),
        // borderColor: '#fff'
    },
    itemActivity: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: scale(2),
        borderRightWidth: scale(1),
    },
    exitsEvent: {
        backgroundColor: 'rgba(105, 145, 245, .1)',
        borderWidth: scale(1),
        borderColor: calendarColor.border
    },
    textEvent: {
        fontSize: scale(10.5),
        marginTop: scale(3),
        flex: 2,
        textAlign: 'center'
    },
    textEventSubject: {
        fontSize: scale(10.5),
        flex: 1,
        paddingTop: scale(6),
        textAlign: 'center'
    },
    viewItemEvent: {
        flex: 1,
        // borderRightWidth: scale(1),
        // borderColor: calendarColor.border,
    },
    childPicker: {
        marginStart: scale(3),
        marginEnd: scale(3)
    },
    bgInactive: {
        backgroundColor: buttonColor.bgInactive
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
    divider: {
        width: '100%',
        height: scale(1)
    },
    viewNotice: {
        width: '100%', 
        height: scale(55), 
        position: 'absolute', 
        bottom: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: sizeStandard.paddingContent,
        borderTopWidth: scale(1),
        backgroundColor: '#fff',
        borderColor: buttonColor.border
    },
    btnCancelEdit: {
        width: scale(65),
        height: scale(35),
        borderWidth: scale(1),
        borderColor: buttonColor.border
    }
}