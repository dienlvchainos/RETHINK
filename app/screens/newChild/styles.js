import { Dimensions } from 'react-native';
const width = Dimensions.get('window').width;
import { scale } from '../../utils/scalingUtils';
import { mainColor } from '../../utils/styleUtils';
import { Fonts, sizeStandard, buttonColor } from '../../utils/styleUtils';

export default styles = {
    container: {
        flex: 1,
        backgroundColor: mainColor.bg
    },
    content: {
        flex: 1,
        paddingHorizontal: scale(sizeStandard.paddingContent)
    },
    viewAvatar: {
        flex: 4,
        justifyContent: 'center',
        alignItems: 'center'
    },
    info: {
        flex: 6,
        alignItems: 'center'
    },
    avatarContainer: {
        width: scale(155),
        height: scale(155),
        borderRadius: scale(155/2),
        borderWidth: scale(1),
        borderColor: ''
    },
    avatar: {
        width: scale(155),
        height: scale(155),
        borderRadius: scale(155/2),
        borderWidth: scale(2),
        borderColor: '#000'
    },
    btcChangeAvatar: {
        width: scale(31.2),
        height: scale(31.2)
    },
    pickerContainer: {
        position: 'absolute',
        marginTop: scale(50),
        right: width/3.5,
        borderWidth: 0,
        borderRadius: scale(5),
        height: scale(67),
        elevation: 5
    },
    viewButton: {
        marginTop: scale(20),
        alignItems: 'flex-end'
    },
    itemPicker: {
        width: scale(138),
        height: scale(33),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    iconPicker: {
        width: scale(19.6),
        height: scale(16),
        marginRight: scale(10)
    },
    inputRadio: {
        width: '100%',
        height: scale(40),
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        alignSelf: 'flex-start',
        paddingHorizontal: scale(10),
        marginTop: scale(25)
    },
    titleInputRadio: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    dotIcon: {
        width: scale(7),
        height: scale(7),
        marginBottom: scale(5)
    },
    viewGender: {
        width: scale(120),
        marginLeft: scale(54),
        
    },
    btnActiveStyle: {
        backgroundColor: buttonColor.bgActive,
        borderWidth: 0,
        width: scale(240)
    },
    btnInactiveStyle: {
        width: scale(240),
        backgroundColor: buttonColor.bgInactive
    },
    textActiveStyle: {
        ...Fonts.NanumBarunGothic_Bold
    },
    textInactiveStyle: {

    }
}