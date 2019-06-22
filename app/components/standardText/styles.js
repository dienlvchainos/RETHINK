import { scale } from '../../utils/scalingUtils';
import { mainColor, Fonts } from '../../utils/styleUtils';

export default {
    titleStyle: {
        color: mainColor.text,
        fontSize: scale(16),
        ...Fonts.NanumBarunGothic_Bold
    },
    normalStyle: {
        color: mainColor.text,
        fontSize: scale(14),
        ...Fonts.NanumBarunGothic_Regular
    },
    largeStyle: {
        color: mainColor.text,
        fontSize: scale(20),
        ...Fonts.NanumBarunGothic_Bold
    },
    smallStyle: {
        color: mainColor.text,
        fontSize: scale(12),
        ...Fonts.NanumBarunGothic_Regular
    }
}