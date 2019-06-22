import React from 'react';
import { createDeepLinkingHandler } from 'react-native-deep-link';
import { NavigationActions } from 'react-navigation';

class BaseNavigation extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        
    }
}

export default BaseNavigation;

const handleTimetableDeepLink = ({ dispatch }) => ({ params: { child, permission } }) => {
    dispatch(NavigationActions.navigate({
        routeName: 'timetable',
        params: { child, permission }
    }));
}

export const withDeepLinking = createDeepLinkingHandler([
    {
        name: 'http:',
        routes: [{
            expression: '/45.76.55.157/timetable',
            callback: handleTimetableDeepLink
        }]
    },
    {
        name: 'rethink:',
        routes: [{
            expression: '/timetable/:child/:permission',
            callback: handleTimetableDeepLink
        }]
    }
]);