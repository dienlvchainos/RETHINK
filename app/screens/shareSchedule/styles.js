import { scale } from '../../utils/scalingUtils';
import { mainColor } from '../../utils/styleUtils';
import { Fonts, sizeStandard, buttonColor } from '../../utils/styleUtils';

export default styles = {
    container: {
        flex: 1,
        backgroundColor: mainColor.bg
    },
    headerList: {
        flexDirection: 'row',
        marginStart: scale(sizeStandard.paddingContent),
        marginEnd: scale(sizeStandard.paddingContent),
        alignItems: 'flex-end',
        borderBottomWidth: scale(1),
        borderColor: buttonColor.bgInactive,
        marginTop: scale(22),
        marginBottom: scale(22)
    },
    optionShare: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: scale(sizeStandard.paddingContent)
    },
    inRow: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    icon: {
        width: scale(24),
        height: scale(23)
    },
    textCheckbox: {
        color: mainColor.text,
        fontSize: scale(14),
        ...Fonts.NanumBarunGothic_Regular
    },
    viewChild: {
        alignItems: 'center',
        paddingTop: scale(50)
    }
}