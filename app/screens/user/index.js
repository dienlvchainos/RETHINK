import React from 'react'
import {FlatList, View, TouchableOpacity, Text, Image} from 'react-native'

export default class User extends React.Component{

    render(){
        return (
            <View style={{flex:1}}>
                
                <TouchableOpacity style={{paddingTop:20, position:'absolute'}} onPress={() => this.props.navigation.goBack()}>
                    <Text style={{color:'white', fontSize:30, margin:20}}>✖</Text>
                </TouchableOpacity>

            </View>
        )
    }
}