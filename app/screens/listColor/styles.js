import { scale } from '../../utils/scalingUtils';
import { mainColor } from '../../utils/styleUtils';
import { sizeStandard } from '../../utils/styleUtils';

export default styles = {
    container: {
        flex: 1,
        backgroundColor: mainColor.bg
    },
    content: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: scale(sizeStandard.paddingContent)
    },
    item: {
        width: scale(50),
        height: scale(50),
        borderRadius: scale(25),
        marginTop: scale(24),
        justifyContent: 'center',
        alignItems: 'center'
    },
    inItem: {
        width: scale(46),
        height: scale(46),
        borderRadius: scale(23),
        borderWidth: scale(2),
        borderColor: '#fff'
    }
}