import { scale } from '../../utils/scalingUtils';
import { mainColor, Fonts } from '../../utils/styleUtils';

export default {
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap'
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    textCheckbox: {
        margin: 0,
        padding: 0
    },
    radio: {
        width: scale(18),
        height: scale(18),
        borderWidth: scale(1),
        borderRadius: scale(9),
        borderColor: '#DDE5F6',
        justifyContent: 'center',
        alignItems: 'center'
    },
    dot: {
        width: scale(10),
        height: scale(10),
        borderRadius: scale(5),
        backgroundColor: mainColor.main
    }
}