import { Dimensions } from 'react-native';
const height = Dimensions.get('window').height;
import { scale } from '../../utils/scalingUtils';
import { mainColor, Fonts } from '../../utils/styleUtils';

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
        paddingBottom: scale(3),
        paddingHorizontal: scale(10)
    },
    icon: {
        width: scale(20.5),
        height: scale(14.6),
        marginBottom: scale(5)
    },
    iconActionRight: {
        width: scale(11.5),
        height: scale(11),
        marginBottom: scale(5)
    },
    dotIcon: {
        width: scale(7),
        height: scale(7),
        marginBottom: scale(5)
    },
    input: {
        flex: 6,
        color: mainColor.text,
        fontSize: scale(14),
        ...Fonts.NanumBarunGothic_Regular,
        paddingLeft: scale(10),
        paddingBottom: 0
    }
}