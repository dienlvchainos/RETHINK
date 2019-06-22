import { scale } from '../../utils/scalingUtils';
import { mainColor } from '../../utils/styleUtils';
import { sizeStandard, buttonColor } from '../../utils/styleUtils';

export default styles = {
    container: {
        flex: 1,
        backgroundColor: mainColor.bg,
        paddingBottom: scale(15)
    },
    gallery: {
        width: '100%',
        height: scale(55),
        backgroundColor: buttonColor.bgInactive,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingLeft: scale(17)
    },
    iconChild: {
        width: scale(36),
        height: scale(36),
        borderRadius: scale(36/2),
        overflow: 'hidden'
    },
    list: {
        paddingHorizontal: scale(sizeStandard.paddingContent)
    },
    headerList: {
        borderBottomWidth: scale(1),
        borderColor: buttonColor.bgInactive,
        marginTop: scale(22),
        marginBottom: scale(22)
    },
    item: {
        width: scale(158),
        height: scale(230),
        marginRight: scale(10),
        borderRadius: scale(5),
        overflow: 'hidden',
        justifyContent: 'flex-end'
    },
    infoItem: {
        backgroundColor: '#1D252D',
        justifyContent: 'center',
        alignItems: 'center',
        height: '27%'
    },
    textCreate: {
        flexDirection: 'row',
        backgroundColor: '#1D252D',
        justifyContent: 'center',
        alignItems: 'center',
        height: '27%'
    }
}