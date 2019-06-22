import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');
import { scale } from "../../utils/scalingUtils";

export default {
    container: {
        backgroundColor: "rgba(29, 37, 45, .5)",
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        width: width / 3,
        height: height / 9,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: scale(3)
    }
}