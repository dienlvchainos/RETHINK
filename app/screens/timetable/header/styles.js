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
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1
    },
    btnBack: {
        marginLeft: 0,
        marginRight: 0
    },
    viewRight: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end'
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
    },
    inRow: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    inRowChild: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    pickerContainer: {
        marginTop: scale(10),
        width: scale(160),
        borderWidth: 0,
        borderRadius: scale(5),
        elevation: 5
    },
    itemChildPicker: {
        width: '100%',
        height: scale(40),
        paddingHorizontal: scale(sizeStandard.paddingContent),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    }
}