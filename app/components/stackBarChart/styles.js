import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');
import { scale } from "../../utils/scalingUtils";
import { buttonColor } from '../../utils/styleUtils';

export default {
    container: {
        width: '100%',
        height: scale(80),
        borderRadius: scale(10),
        borderWidth: scale(1),
        borderColor: buttonColor.border,
        padding: scale(10)
    },
    content: {
        
    },
    viewItem: {
        
    }
}