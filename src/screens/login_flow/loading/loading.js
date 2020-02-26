import React from 'react'
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native'

import { getNameAndFacebookId } from '../../../data_utils/facebook_utils'

import { getUserByFacebookId } from '../../../data_utils/handle_user'

export default class Loading extends React.Component {
  componentDidMount() {    
    getNameAndFacebookId(async (err, res) => {
      if(err){
        console.log(err)
        this.props.navigation.navigate('Login')
  
      } else {
        //make a new request checking for the facebook id
        //if you found it then goto main screen
        //if you don't got to tag screen        
        getUserByFacebookId(res.id, (user) => {
          console.log("callback called")
          
          if(user._id){
            console.log("Id is defined")
            this.props.navigation.navigate("Stack")
          } else {
            console.log("Id is not defined")
            this.props.navigation.navigate("Tag", {"facebook_info": res})
          }
        })
        
      }
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Loading</Text>
        <ActivityIndicator size="large" />
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
})