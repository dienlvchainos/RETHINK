import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');
import { scale } from "../../utils/scalingUtils";

export default {
    modal: {
        width: width,
        height: height
    },
    container: {
        flex: 1
    },
    toolbar: {
        flex: 0.5,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        paddingRight: scale(17),
        backgroundColor: '#000'
    },
    content: {
        flex: 8.5
    }
}