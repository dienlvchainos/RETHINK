import React from 'react'
import {FlatList, View, TouchableOpacity, Text, Image} from 'react-native'

export default class AdvancedScreen extends React.Component{

    static navigationOptions = (props) => ({
        title:'Advanced Screen',
    })

    render(){
        return (
            <View>
                <Text>key of previous screen : {this.props.navigation.state.params.keyGoBackToRoot}</Text>
                <TouchableOpacity onPress={() => this.props.navigation.goBack(this.props.navigation.state.params.keyGoBackToRoot)} style={{margin:20}}>
                    <Text style={{color:'blue'}}>Go Back to Root</Text>
                </TouchableOpacity>
            </View>
        )
    }
}