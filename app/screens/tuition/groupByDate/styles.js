import { scale } from '../../../utils/scalingUtils';
import { Dimensions } from 'react-native';
import { Fonts, sizeStandard, buttonColor, mainColor } from '../../../utils/styleUtils';
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default styles = {
    container: {
        backgroundColor: mainColor.bg

    },
    header: {
        height: scale(50),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: sizeStandard.paddingContent,
        backgroundColor: buttonColor.bgInactive
    },
    item: {
        flex: 1,
        height: scale(55),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: sizeStandard.paddingContent,
        borderBottomWidth: scale(1),
        borderColor: buttonColor.border
    }
}