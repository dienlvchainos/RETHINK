import { scale } from '../../utils/scalingUtils';
import { mainColor } from '../../utils/styleUtils';
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
        // borderBottomWidth: scale(1),
        // borderColor: '#DDE5F6',
        justifyContent: 'center',
        alignItems: 'center'
    },
    viewTime: {
        width: width / 8
    },
    itemDayOfWeek: {
        flex: 1,
        justifyContent: 'center'
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
        borderColor: '#DDE5F6',
    },
    viewHeader: {
        width: width - width / 8,
        flexDirection: 'row'
    },
    viewEvent: {
        flex: 1,
        width: width - width / 9,
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    itemEvent: {
        // width: (width - width / 8) / 7,
        height: scale(80),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: scale(2)
    },
    exitsEvent: {
        backgroundColor: 'rgba(105, 145, 245, .1)',
        borderWidth: scale(1),
        borderColor: '#DDE5F6'
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
        width: (width - width / 8) / 7,
        borderWidth: scale(1),
        borderColor: '#DDE5F6',
    },
    childPicker: {
        marginStart: scale(3),
        marginEnd: scale(3)
    },
    bgInactive: {
        backgroundColor: buttonColor.bgInactive
    }
}