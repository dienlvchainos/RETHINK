import { scale } from '../../../utils/scalingUtils';
import { mainColor, calendarColor } from '../../../utils/styleUtils';
import { Dimensions } from 'react-native';
const width = Dimensions.get('window').width;
import { Fonts, sizeStandard, buttonColor } from '../../../utils/styleUtils';

export default styles = {
    container: {
        flex: 1,
        backgroundColor: mainColor.bg
    },
    copyInfo: {
        flex: 4.5,
        paddingVertical: scale(15)
        // flexDirection: 'row',
    },
    copyAction: {
        flex: 1,
        flexDirection: 'row',
        borderTopWidth: scale(1),
        borderColor: buttonColor.border
    },
    mgTop: {
        marginTop: scale(20),
        padding: 0
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
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: scale(30)
    },
    itemInRow: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start'
    }
}