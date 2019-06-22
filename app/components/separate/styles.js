import { Dimensions } from 'react-native';
const height = Dimensions.get('window').height;
import { scale } from '../../utils/scalingUtils';
import { mainColor } from '../../utils/styleUtils';

export default {
    container: {
        width: scale(1),
        height: scale(16),
        backgroundColor: '#E5EAF7'
    }
}