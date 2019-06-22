import { Dimensions } from 'react-native';
const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;
import { scale } from '../../utils/scalingUtils';
import { mainColor, buttonColor, Fonts, sizeStandard } from '../../utils/styleUtils';

export default {
    container: {
        flex: 1,
        backgroundColor: mainColor.bg
    },
    content: {
        paddingHorizontal: scale(11),
        paddingBottom: scale(1),
        height: height - height / 11 - scale(140)
    },
    img: {
        // width: width * 0.7,
        height: (height - scale(120) - height/11 - scale(25)),
        justifyContent: 'center',
        borderRadius: scale(5),
        paddingVertical: scale(sizeStandard.paddingContent),
        paddingHorizontal: scale(20 - sizeStandard.paddingContent),
        borderRadius: scale(5),
        overflow: 'hidden'
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: scale(5)
    },
    bottomMenu: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: scale(120),
        justifyContent: 'flex-end',
        backgroundColor: 'transparent'
    },
    imgItem: {
        width: scale(100),
        height: scale(100),
        marginStart: scale(6),
        marginEnd: scale(6),
        marginTop: scale(12)
    },
    viewNoChild: {
        height: height - height / 11 - scale(140),
        justifyContent: 'center',
        alignItems: 'center'
    }
}