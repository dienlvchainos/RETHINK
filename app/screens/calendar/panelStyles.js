import { Dimensions } from 'react-native';
const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;
import { scale } from '../../utils/scalingUtils';
import { mainColor, buttonColor, sizeStandard, Fonts } from '../../utils/styleUtils';

export default styles = {
    container: {
        flex: 1,
        backgroundColor: mainColor.bg

    },
    content: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    viewIconClose: {
        flex: .3,
        justifyContent: 'center',
        alignItems: 'center'
    },
    viewTitle: {
        flex: .3,
        // height: scale(40),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: buttonColor.bgInactive
    },
    viewTitleSticky: {
        height: scale(40),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: buttonColor.bgInactive
    },
    viewContent: {
        flex: 4,
        flexDirection: 'row',
    },
    viewContent1: {
        flex: 4,
        alignItems: 'center'
    },
    itemDay: {
        flex: 1,
    },
    itemDetail: {
        flex: 1,
        alignItems: 'center'
    },
    itemEvent: {
        marginTop: scale(20),
        justifyContent: 'center',
        alignItems: 'center'
    },
    viewAddressInput: {
        flex: .8,
        marginTop: scale(20)
    },
    viewDate: {
        flexDirection: 'row',
        width: '100%',
        height: scale(44),
        paddingVertical: scale(2)
    },
    viewDateItem: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // borderWidth: scale(1),
        // borderColor: buttonColor.bgInactive
    },
    viewDateCenter: {
        width: scale(20)
    },
    viewDateActive: {
        // borderWidth: 0,
        // backgroundColor: '#FABC05'
    },
    modalSelectChild: {
        width: width - sizeStandard.paddingContent * 2,
        height: height / 2.6,
        borderRadius: scale(5),
        overflow: 'hidden'
    },
    
}