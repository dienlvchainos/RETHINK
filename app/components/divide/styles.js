import { Dimensions } from 'react-native';
const height = Dimensions.get('window').height;
import { scale } from '../../utils/scalingUtils';
import { mainColor } from '../../utils/styleUtils';

export default {
    container: {
        height: scale(1),
        marginStart: scale(15),
        marginEnd: scale(15),
        marginTop: scale(15),
        borderBottomWidth: scale(1),
        borderColor: '#E5EAF7'
    }
}