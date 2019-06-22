import { Platform, AlertIOS, ToastAndroid } from 'react-native';

const message = {
    inform: '공지 사항',
    acceptPolicy: '정책 및 약관에 동의해야 합니다',
    invalidData: "데이터를 충분히 입력하시고 다시 시도하여 주십시오!",
    emailInvalid: "이 이메일은 유효하지 않습니다.",
    passwordIncorrect: "잘못된 형식의 비밀번호를 입력하셨습니다",
    passwordNotSame: "비밀번호가 일치하지 않습니다",
    registerFail: '등록 실패.다시 시도하십시오!',
    loginFail: '로그인 실패. 다시 시도하십시오!',
    loginDataWrong: '로그인 정보가 올바르지 않습니다. 다시 시도하십시오!',
    errorServer: '시스템에서 오류가 발생했습니다. 다시 시도하십시오!',
    undefineError: '식별되지 않은 오류입니다.',
    success: '성공',
    noSocialAvailable: '소셜 네트워크에는 사용할 수 없음',
    notFoundChild: '개체가 존재하지 않습니다',
    imageInvalid: '이미지가 잘못되었습니다, 다른 이미지를 시도하십시오',
    needConfigTimetable: '시간표를 설정해야합니다',
    needCreateChild: '아이를 추가하시기 바랍니다',
    editTimetaleMode: '시간표 편집 모드 설정 켬',
    offEditTimetaleMode: '시간표 편집 모드 설정 끔',
    selectOneChild: '아이를 선택하기',
    noExistsCopy: "시간표를 아직 안하기",
    noShowEvent: '',
    unauthorized: '무단의',
    plsSelectChild: '하나 이상의 아이를 선택하십시오',
    startTimeGreaterThan: '종료 시간은 시작 시간보다 커야합니다',
    successEmailResetPassword: '비밀번호를 변경하려면 이메일을 확인하십시오',
    selectRelationship: '관계를 선택하십시오',
    errorDataCalendar: '캘린더 데이터를 가져 오는 중에 오류가 발생했습니다',
    invalidDateRange: '올바른 기간을 선택해주시기 바랍니다',
    backAndroidToExit: '종료하려면 [BACK] 버튼을 한 번 더 누르십시오',
    passwordUpdated: '암호가 업데이트되었습니다',
    errorWhenDelete: '데이터를 삭제하는 중 오류가 발생했습니다'
}

function inform(_message) {
    if (Platform.OS == 'ios') {
        return AlertIOS.alert(
            message.inform,
            _message
        );
    } else {
        return ToastAndroid.show(_message, ToastAndroid.SHORT);
    }
}

export default { message, inform }