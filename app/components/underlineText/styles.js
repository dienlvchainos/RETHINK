import { Dimensions } from 'react-native';
const height = Dimensions.get('window').height;
import { scale } from '../../utils/scalingUtils';
import { mainColor } from '../../utils/styleUtils';

export default {
    container: {
        alignSelf: 'flex-start',
        borderBottomWidth: scale(2),
        borderBottomColor: mainColor.popupHeaderBorder,
        paddingBottom: 2
    }
}