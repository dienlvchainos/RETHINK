import { Dimensions } from 'react-native';
const height = Dimensions.get('window').height;
import { scale } from '../../../utils/scalingUtils';
import { mainColor, buttonColor, Fonts } from '../../../utils/styleUtils';

export default {
    container: {
        
    },
    bar: {
        height: scale(28),
        justifyContent: 'center',
        alignItems: 'center',
    },
    fullBar: {
        flexDirection: 'row',
        height: scale(28),
        width: '100%'
    },
    text: {
        color: '#FFF',
        fontSize: scale(9)
    }
}