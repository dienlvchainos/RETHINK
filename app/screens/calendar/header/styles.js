import { Dimensions } from 'react-native';
const height = Dimensions.get('window').height;
import { scale } from '../../../utils/scalingUtils';
import { mainColor, Fonts, sizeStandard } from '../../../utils/styleUtils';

export default {
    container: {
        width: '100%',
        height: height / 11,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: mainColor.headerPopup,
        alignSelf: 'flex-start',
        paddingLeft: 0,
        borderBottomWidth: scale(1),
        borderColor: mainColor.headerBorder
    },
    viewBack: {
        width: scale(60),
        height: scale(40),
        // position: 'absolute',
        // left: 0,
        // flexDirection: 'row',
        // alignItems: 'center',
        // justifyContent: 'center',
    },
    btnBack: {
        marginLeft: 0,
        marginRight: 0,
    },
    viewRight: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingRight: scale(sizeStandard.paddingContent),
    },
    title: {
        fontSize: scale(16),
        color: mainColor.text,
        ...Fonts.NanumBarunGothic_Bold,
        textAlign: 'center'
    },
    btnRightIcon: {
        marginLeft: 0,
        position: 'absolute',
        right: 0,
        bottom: 0
    }
}