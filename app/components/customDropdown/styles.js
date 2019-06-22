import { Dimensions } from 'react-native';
const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;
import { scale } from '../../utils/scalingUtils';
import { mainColor, Fonts, sizeStandard, buttonColor } from '../../utils/styleUtils';

export default {
    container: {
        flex: 1
    },
    picker: {
        flex: .5,
        flexDirection: 'row',
        alignItems: 'center',
        marginStart: scale(sizeStandard.paddingContent),
        marginEnd: scale(sizeStandard.paddingContent),
        paddingBottom: scale(3),
        borderBottomWidth: scale(1),
        borderColor: buttonColor.border
    },
    itemPicker: {
        width: '100%',
        height: scale(50),
        paddingHorizontal: scale(sizeStandard.paddingContent),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    pickerContainer: {
        marginTop: scale(15),
        width: width - scale(30),
        borderWidth: 0,
        borderBottomLeftRadius: scale(5),
        borderBottomRightRadius: scale(5),
        height: scale(100),
        elevation: 5
    },
}