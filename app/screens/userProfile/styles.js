import { Dimensions } from 'react-native';
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
import { scale } from '../../utils/scalingUtils';
import { mainColor } from '../../utils/styleUtils';
import { sizeStandard, buttonColor } from '../../utils/styleUtils';

export default styles = {
    container: {
        flex: 1,
        backgroundColor: mainColor.bg
    },
    viewAvatar: {
        flex: 4,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: scale(5)
    },
    info: {
        flex: 4.2,
        paddingHorizontal: scale(sizeStandard.paddingContent),
        justifyContent: 'center'
    },
    viewLogout: {
        flex: 1.8,
        justifyContent: 'center',
        paddingLeft: scale(17)
    },
    avatar: {
        width: scale(145),
        height: scale(145),
        borderRadius: scale(145 / 2)
    },
    btcChangeAvatar: {
        width: scale(31.2),
        height: scale(31.2)
    },
    item: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderTopWidth: scale(1),
        borderColor: buttonColor.border
    },
    leftItem: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    itemIcon: {
        width: scale(20),
        height: scale(20)
    },
    viewButton: {
        position: 'absolute',
        right: scale(5),
        top: scale(4),
        zIndex: 10000,
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
    pickerContainer: {
        position: 'absolute',
        // marginTop: scale(50),
        top: 0,
        right: width / 3.5,
        borderWidth: 0,
        borderRadius: scale(5),
        height: scale(67),
        elevation: 5
    },
    modalDelete: {

    },
    modalDelete: {
        width: width - sizeStandard.paddingContent * 2,
        height: height / 2.6,
        borderRadius: scale(5),
        overflow: 'hidden'
    },
    contentPopupDelete: {
        flex: 3.6,
        alignItems: 'center'
    },
    headerPopupDelete: {
        flex: 1,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: scale(1),
        borderColor: buttonColor.border
    },
    formPopupDelete: {
        flex: 3,
        justifyContent: 'flex-start',
        paddingTop: scale(20),
        paddingHorizontal: scale(sizeStandard.paddingContent * 2)
    },
    contentAction: {
        flex: 1,
        flexDirection: 'row',
        borderTopWidth: scale(1),
        borderColor: buttonColor.border
    },
    btnLeftModal: {
        flex: 1,
        borderRightWidth: scale(1),
        borderColor: buttonColor.border,
        borderRadius: 0,
        height: null,
    },
    btnModal: {
        flex: 1,
        borderRadius: 0,
        height: null,
    },
}