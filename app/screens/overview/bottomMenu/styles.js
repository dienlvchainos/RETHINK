import { Dimensions } from 'react-native';
const height = Dimensions.get('window').height;
import { scale } from '../../../utils/scalingUtils';
import { mainColor, buttonColor, Fonts } from '../../../utils/styleUtils';

export default {
    container: {
        height: scale(120),
        backgroundColor: mainColor.bg
    },
    mainMenu: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between'
    },
    subMenu: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        backgroundColor: '#F9F9F9'
    },
    tabItem: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    selected: {
        borderBottomWidth: scale(4),
        borderColor: buttonColor.borderActive
    },
    icon: {
        width: scale(28),
        height: scale(23),

    }
}