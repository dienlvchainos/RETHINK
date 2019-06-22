import { scale } from '../../utils/scalingUtils';
import { mainColor } from '../../utils/styleUtils';
import { Fonts, sizeStandard, buttonColor } from '../../utils/styleUtils';

export default styles = {
    container: {
        flex: 1,
        paddingHorizontal: scale(sizeStandard.paddingContent),
        backgroundColor: mainColor.bg
    },
    img: {
        flex: 2,
        width: '100%',
        alignSelf: 'stretch',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: scale(40)
    },
    content: {
        flex: 1,
        paddingTop: scale(10)
    },
    btn: {
        borderWidth: scale(1.5),
        borderColor: buttonColor.border,
        backgroundColor: '#FFF',
        borderRadius: scale(5),
        height: scale(sizeStandard.inputHeight),
        marginTop: scale(10),
        justifyContent: 'center',
        alignItems: 'center'
    },
    txtBtn: {
        fontSize: scale(20),
        color: mainColor.textButton,
        ...Fonts.NanumBarunGothic_Regular,
        textAlign: 'center'
    }
}