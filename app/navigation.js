import React from 'react'
import { SafeAreaView } from 'react-native'
import { Provider } from 'react-redux';
import { StackNavigator } from 'react-navigation'
import { Screen } from './screens/initScreen';
import configureStore from './configureStore';
import BaseNavigation from './baseNavigation';
// import CodePush from "react-native-code-push";
import AppConfig from './config';

const store = configureStore();

const DrawerStack = StackNavigator(
    {
        drawer: Screen.Drawer
    }, {
        headerMode: 'none'
    }
)

const UserStack = StackNavigator(
    {
        userProfile: Screen.UserProfile,
        updateProfileUser: Screen.UpdateProfileUser,
        changePassword: Screen.ChangePassword,
        changeEmail: Screen.ChangeEmail,

    }, {
        headerMode: 'none'
    }
)

const ChildStack = StackNavigator(
    {
        childs: Screen.ListChild,
        editChild: Screen.EditChild,
        // newChild: Screen.NewChild,
        // listColor: Screen.ListColor
    }, {
        headerMode: 'none'
    }
)

const StartedStack = StackNavigator(
    {
        gettingStarted: Screen.GettingStarted,
        login: Screen.Login,
        register: Screen.Register,
        additionInfo: Screen.AdditionInfo
    }, {
        headerMode: 'none'
    }
)

const TimetableStack = StackNavigator(
    {
        timetable: Screen.Timetable,
        editTime: Screen.EditTime
    }, {
        headerMode: 'none'
    }
)

const CalendarStack = StackNavigator(
    {
        calendar: Screen.Calendar,
        createEvent: Screen.CreateEvent
    }, {
        headerMode: 'none'
    }
)

const OverviewStack = StackNavigator(
    {
        overview: Screen.Overview,
        timetable: TimetableStack,
        calendar: CalendarStack
    }, {
        headerMode: 'none'
    }
)

const EducationStack = StackNavigator(
    {
        education: Screen.Education,
        newEducation: Screen.CreateEducation
    }, {
        headerMode: 'none'
    }
)

const TuitionStack = StackNavigator(
    {
        tuition: Screen.Tuition
    }, {
        headerMode: 'none'
    }
)

// Navigation Stack (root)
const NavigationStack = StackNavigator(
    {
        gettingStarted: StartedStack,
        updatePassword: Screen.UpdatePassword,
        overview: OverviewStack,
        drawer: DrawerStack,
        childs: { screen: ChildStack },
        education: EducationStack,
        tuition: TuitionStack,
        report: Screen.Report,
        userProfile: UserStack,
        resetPassword: Screen.ResetPassword,
        newChild: Screen.NewChild,
        listColor: Screen.ListColor,
        shareSchedule: Screen.ShareSchedule
    }, {
        mode: 'card',
        headerMode: 'none',
        initialRouteName: 'overview'
    }
)

AppConfig._configPushNotification();

class Navigation extends BaseNavigation {

    async componentWillMount() {
        // CodePush.sync({
        //     updateDialog: true,
        //     installMode: CodePush.InstallMode.IMMEDIATE
        // });
    }

    render() {
        return (
            <Provider store={store}>
                <SafeAreaView style={{ flex: 1 }}>
                    <NavigationStack key='navigation' />
                </SafeAreaView>
            </Provider>
        )
    }
}

// let codePushOptions = { checkFrequency: CodePush.CheckFrequency.MANUAL };

// export default withDeepLinking(Navigation);
// export default CodePush(codePushOptions)(Navigation);
export default Navigation;