import React from 'react';
import { Platform } from 'react-native';

/**
 * Color
 */
const mainColor = {
    main: '#FABC05',
    bg: '#FFFFFF',
    textButton: '#000',
    buttonActive: '#FABC05',
    text: '#000',
    textInactive: '#E5EAF7',
    headerPopup: '#FFF',
    headerBorder: '#F5F5F5',
    popupHeaderBorder: '#FABC05',
    popupOutlineBorder: '#E5EAF7',
    inputBorder: '#E5EAF7',
    placeholder: '#DDE2EC',
    seperateColor: '#DDE5F6',
    defaultEvent: '#000'
}

const buttonColor = {
    underlay: '#FABC05',
    bgWhite: '#FFFFFF',
    bgActive: '#FABC05',
    bgInactive: '#EDEFEF',
    border: '#E5EAF7',
    borderActive: '#FABC05'
}

const calendarColor = {
    border: '#DDE5F6',
    bgWhite: '#FFFFFF'
}

/**
 * Other
 */
const sizeStandard = {
    inputHeight: 50,
    paddingContent: 15,
    heightEvent: 53,
    offsetKeyboard100: 100,
    offsetKeyboard50: 40
}

/**
 * Fonts
 */
const iosFonts = {
    NanumBarunGothic_Regular: {
        fontFamily: 'NanumBarunGothicRegular'
    },
    NanumBarunGothic_Light: {
        fontFamily: 'NanumBarunGothicLight'
    },
    NanumBarunGothic_Bold: {
        fontFamily: 'NanumBarunGothicBold'
    }
}

const androidFonts = {
    NanumBarunGothic_Regular: {
        fontFamily: 'NanumBarunGothicRegular'
    },
    NanumBarunGothic_Light: {
        fontFamily: 'NanumBarunGothicLight'
    },
    NanumBarunGothic_Bold: {
        fontFamily: 'NanumBarunGothicBold'
    }
}

const Fonts = Platform.OS === 'ios' ? iosFonts : androidFonts;

/**
 * Export
 */
export {
    mainColor,
    calendarColor,
    buttonColor,
    Fonts,
    sizeStandard
}