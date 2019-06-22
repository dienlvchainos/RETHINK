import { Dimensions } from 'react-native';
const height = Dimensions.get('window').height;
import { mainColor, Fonts, sizeStandard, buttonColor } from '../../utils/styleUtils';

export default {
    container: {
        flex: 1
    },
    content: {

    },
    modal: {
        height: height / 1.3,
    },
    containerModal: {
        flex: 1,
        backgroundColor: mainColor.bg
    },
}