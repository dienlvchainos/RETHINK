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
        justifyContent: 'flex-end',
        paddingHorizontal: scale(sizeStandard.paddingContent)
    },
    viewHearCreate: {
        flex: .35,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: scale(1),
        borderColor: buttonColor.border
    },
    iconActionRight: {
        width: scale(18),
        height: scale(18)
    },
    viewPickTime: {
        flex: 3.5,
        justifyContent: 'space-between',
        paddingBottom: scale(10)
    },
    pickerReminderContainer: {
        width: scale(158),
        borderWidth: 0,
        borderRadius: scale(5),
        elevation: 5
    },
    viewBottomCreate: { borderTopWidth: scale(1), borderColor: buttonColor.border },
    inRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    alertSelect: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: scale(25)
    },
    iconCreate: {
        width: scale(27),
        height: scale(27)
    },
    itemOptionPicker: {
        width: '100%',
        height: scale(49),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    pickerOptionContainer: {
        width: scale(280),
        borderWidth: 0,
        borderRadius: scale(5),
        elevation: 5
    },
    iconOptionPicker: {
        width: scale(12.2),
        height: scale(16.5)
    },
}