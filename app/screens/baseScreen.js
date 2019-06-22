import React from 'react'
import { } from 'react-native'

class BaseScreen extends React.Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
    }

    navigate(screen, params) {
        const { navigate } = this.props.navigation;
        navigate({ routeName: screen, params: params, action: null, key: screen });
    }

    backScreen() {
        this.props.navigation.goBack();
    }

    componentWillMount() {

    }

    componentDidMount() {

    }
}

export default BaseScreen;