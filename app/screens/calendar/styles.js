import { Dimensions } from 'react-native';
const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;
import { scale } from '../../utils/scalingUtils';
import { mainColor, buttonColor, sizeStandard, Fonts } from '../../utils/styleUtils';

export default styles = {
    container: {
        flex: 1,
        backgroundColor: mainColor.bg

    },
    content: {
        flex: 1,
        paddingHorizontal: scale(sizeStandard.paddingContent),
        alignItems: 'center'
    },
    calendar: {
        borderTopWidth: scale(1),
        paddingHorizontal: -15,
        paddingLeft: -15,
        borderBottomWidth: scale(1),
        borderColor: '#eee',
    },
    inRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemDay: {
        width: '100%',
        height: (height-height/11)/7.5,
        paddingTop: scale(5),
        alignItems: 'center',
        borderBottomWidth: scale(1),
        borderBottomColor: buttonColor.border
    },
    textItemDay: {
        textAlign: 'center',
    },
    textItemDayActive: {
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        width: scale(26),
        height: scale(26),
        borderRadius: scale(26 / 2),
        backgroundColor: '#FABC05'
    },
    textActivity: {
        fontSize: scale(10),
        marginTop: scale(1)
    },
    viewMarking: {
        marginTop: scale(15),
        width: scale(10),
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap'
    },
    viewActivity: {
        marginTop: scale(3),
        paddingHorizontal: scale(1)
    },
    dotMarking: {
        width: scale(4),
        height: scale(4),
        borderRadius: scale(2),
        marginTop: scale(2)
    },
    theme: {
        // paddingHorizontal: -15,
        arrowColor: mainColor.main,
        selectedDayBackgroundColor: '#FABC05',
        dayTextColor: '#000',
        textDayFontSize: scale(14),
        textSectionTitleColor: '#000',
        'stylesheet.calendar.header': {
            week: {
                paddingHorizontal: 30,
                marginLeft: -15,
                width: width,
                height: height/13,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: buttonColor.bgInactive
            },
            dayHeader: {
                color: '#000',
                textAlign: 'center',
                ...Fonts.NanumBarunGothic_Bold,
                fontSize: scale(16)
            }
        }
    }
}