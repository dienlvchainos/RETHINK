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
    },
    pasteContent: {
        flex: 3.6,
        alignItems: 'center'
    },
    titlePaste: {
        flex: 1,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: scale(1),
        borderColor: buttonColor.border
    },
    pickChildToPaste: {
        flex: 3,
        justifyContent: 'flex-start',
        paddingTop: scale(10),
        paddingHorizontal: scale(sizeStandard.paddingContent * 2)
    },
    pasteItemChild: {
        height: scale(35),
        marginStart: scale(sizeStandard.paddingContent / 2),
        marginEnd: scale(sizeStandard.paddingContent / 2)
    }
}