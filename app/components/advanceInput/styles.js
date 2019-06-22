import { Dimensions } from 'react-native';
const width = Dimensions.get('window').width;
import { scale } from '../../utils/scalingUtils';
import { mainColor, Fonts, sizeStandard } from '../../utils/styleUtils';

export default {
    container: {
        width: '100%',
        height: scale(40),
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        alignSelf: 'flex-start',
        borderBottomWidth: scale(1.5),
        borderColor: mainColor.inputBorder,
        borderRadius: scale(5),
        paddingBottom: scale(4),
        paddingHorizontal: scale(10)
    },
    icon: {
        width: scale(20.5),
        height: scale(14.6),
        marginBottom: scale(5)
    },
    dotIcon: {
        width: scale(7),
        height: scale(7),
        marginBottom: scale(5),
        marginRight: scale(5)
    },
    input: {
        flex: 6,
        color: mainColor.text,
        fontSize: scale(16),
        ...Fonts.NanumBarunGothic_Regular,
        textAlign: 'center',
        paddingBottom: 0,
        textAlignVertical: 'bottom'
    },
    viewRightAction: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    itemRightAction: {
        width: scale(20),
        height: scale(20),
        borderRadius: scale(10)
    },
    hintText: {
        flex: 3.3,
        flexDirection: 'row',
        alignItems: 'flex-end'
    },
    inRow: {
        flexDirection: 'row',
    }
}