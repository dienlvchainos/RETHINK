import { Dimensions } from 'react-native';
const height = Dimensions.get('window').height;
import { scale } from '../../utils/scalingUtils';
import { mainColor, Fonts } from '../../utils/styleUtils';

export default {
    container: {
        width: '100%',
        height: scale(45),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        borderRadius: scale(5)
    },
    text: {
        color: mainColor.text,
        fontSize: scale(14),
        ...Fonts.NanumBarunGothic_Bold
    }
}