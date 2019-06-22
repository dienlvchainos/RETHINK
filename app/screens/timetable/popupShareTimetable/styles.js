import { scale } from '../../../utils/scalingUtils';
import { mainColor, calendarColor } from '../../../utils/styleUtils';
import { Dimensions } from 'react-native';
const width = Dimensions.get('window').width;
import { Fonts, sizeStandard, buttonColor } from '../../../utils/styleUtils';

export default styles = {
    container: {
        flex: 1,
        backgroundColor: mainColor.bg,
        paddingLeft: scale(40),
    },
    pickerContainer: {
        width: scale(240),
        height: scale(94),
        elevation: 5
    },
    itemPicker: {
        flex: 1,
        alignSelf: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    icon: {
        width: scale(27),
        height: scale(22),
        marginRight: scale(25)
    },
    border: {
        borderTopWidth: scale(1),
        borderColor: buttonColor.border
    }
}