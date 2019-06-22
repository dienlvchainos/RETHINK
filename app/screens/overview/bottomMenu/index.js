import React from 'react'
import { TouchableWithoutFeedback, View, Image } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import StandardText from "../../../components/standardText";
import styles from "./styles";
import { scale } from '../../../utils/scalingUtils';

const iconHome = require('../../../assets/icons/homeIcon.png');
const iconEducation = require('../../../assets/icons/educationIcon.png');
const iconQuestion = require('../../../assets/icons/questionIcon.png');

const tabHome = "home";
const tabEducation = "education";
const tabQuestion = "question";

const subs = {
    home: [
        {
            title: '시간표',
            screen: 'timetable',
            icon: require('../../../assets/icons/timetableIcon.png')
        },
        {
            title: '캘린더',
            screen: 'calendar',
            icon: require('../../../assets/icons/calendarIcon.png')
        },
        {
            title: '일정공유',
            screen: 'shareSchedule',
            icon: require('../../../assets/icons/shareIcon.png')
        }
    ],
    education: [
        {
            title: '교육기관',
            screen: 'education',
            icon: require('../../../assets/icons/schoolIcon.png')
        },
        {
            title: '교육비',
            screen: 'tuition',
            icon: require('../../../assets/icons/tuitionIcon.png')
        },
        {
            title: '리포트',
            screen: 'report',
            icon: require('../../../assets/icons/reportIcon.png')
        }
    ],
    // question: [
    //     {
    //         title: '너맘내맘',
    //         screen: 'MyMotherHeart',
    //         icon: require('../../../assets/icons/myMotherHeartIcon.png')
    //     },
    //     {
    //         title: '미세먼지',
    //         screen: 'MicroDust',
    //         icon: require('../../../assets/icons/microDustIcon.png')
    //     },
    //     {
    //         title: '주말약국',
    //         screen: 'Report',
    //         icon: require('../../../assets/icons/findPharmacyIcon.png')
    //     }
    // ]
}

export default class BottomMenu extends React.PureComponent {

    state = {
        selectedTab: tabHome,
        subTabs: subs.home
    }

    _selectedTab = (selectedTab) => () => {
        let subTabs;
        if (selectedTab == tabHome) {
            subTabs = subs.home
        } else if (selectedTab == tabEducation) {
            subTabs = subs.education
        } else {
            subTabs = subs.question
        }
        this.setState({ selectedTab, subTabs });
    }

    _navigate = (screen) => () => {
        this.props.navigationProps.navigate(screen);
    }

    _renderSubMenu() {
        const { subTabs } = this.state;
        return subTabs.map((item, index) => {
            return <TouchableWithoutFeedback key={index} onPress={this._navigate(item.screen)}>
                <View style={[styles.tabItem, {}]}>
                    <Image
                        style={styles.icon}
                        source={item.icon}
                        resizeMode="contain" />
                    <StandardText
                        style={{ marginTop: scale(2), marginBottom: scale(3) }}>{item.title}
                    </StandardText>
                </View>
            </TouchableWithoutFeedback>
        })
    }

    render() {
        const { selectedTab } = this.state;
        return (
            <View style={styles.container}>
                <View style={styles.subMenu}>
                    {this._renderSubMenu()}
                </View>
                <View style={styles.mainMenu}>
                    <TouchableWithoutFeedback onPress={this._selectedTab(tabHome)}>
                        <View style={[styles.tabItem, selectedTab == tabHome ? styles.selected : {}]}>
                            <Image
                                style={styles.icon}
                                source={iconHome}
                                resizeMode="contain" />
                            <StandardText
                                style={{ marginTop: scale(2), marginBottom: scale(3) }}
                                title={selectedTab ? true : false}>홈
                        </StandardText>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={this._selectedTab(tabEducation)}>
                        <View style={[styles.tabItem, selectedTab == tabEducation ? styles.selected : {}]}>
                            <Image
                                style={styles.icon}
                                source={iconEducation}
                                resizeMode="contain" />
                            <StandardText
                                style={{ marginTop: scale(2), marginBottom: scale(3) }}
                                title={selectedTab == tabEducation ? true : false}>교육
                        </StandardText>
                        </View>
                    </TouchableWithoutFeedback>
                    {/* <TouchableWithoutFeedback onPress={this._selectedTab(tabQuestion)}>
                        <View style={[styles.tabItem, selectedTab == tabQuestion ? styles.selected : {}]}>
                            <Image
                                style={styles.icon}
                                source={iconQuestion}
                                resizeMode="contain" />
                            <StandardText
                                style={{ marginTop: scale(2), marginBottom: scale(3) }}
                                title={selectedTab == tabQuestion ? true : false}>궁금해요
                        </StandardText>
                        </View>
                    </TouchableWithoutFeedback> */}
                </View>
            </View>
        )
    }
}