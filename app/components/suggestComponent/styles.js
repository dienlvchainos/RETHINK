import { Dimensions } from 'react-native';
const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;
import { scale } from '../../utils/scalingUtils';
import { mainColor, Fonts, sizeStandard, buttonColor } from '../../utils/styleUtils';

export default {
    container: {
        zIndex: 99999,
        height: scale(200),
        position: 'absolute',
        top: scale(80),
        left: '4%',
        right: '4%',
        backgroundColor: '#FFF',
        elevation: 5,
        overflow: 'hidden',
        zIndex: 99999
    },
    listSuggest: {
        // width: scale(width-sizeStandard.paddingContent*2)
    },
    item: {
        width: '100%',
        height: scale(40),
        paddingHorizontal: scale(sizeStandard.paddingContent),
        flexDirection: 'row',
        alignItems: 'center',
    },
    inRow: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    }
}