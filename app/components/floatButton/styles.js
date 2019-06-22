import { Dimensions } from 'react-native';
import { scale } from '../../utils/scalingUtils';
import { mainColor } from '../../utils/styleUtils';

export default {
    container: {
        position: 'absolute',
        bottom: scale(45),
        right: scale(17),
        zIndex: 99999,
        width: scale(50),
        height: scale(50),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: scale(25),
        overflow: 'hidden',
        backgroundColor: '#FFF',
        elevation: 3
    },
    iconStyle: {
        // width: '100%',
        // height: '100%'
    }
}