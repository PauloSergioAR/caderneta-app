import React from 'react'
import { StyleSheet, Platform, Image, Text, View, ActivityIndicator, FlatList, Dimensions, Picker } from 'react-native'
import firebase from 'react-native-firebase';
import { ListItem, Overlay, Button, Input } from 'react-native-elements';

import DatePicker from 'react-native-datepicker'

import OverlayComponent from './overlay'

import * as IconEntypo from 'react-native-vector-icons/Entypo'
import * as IconFontAwesome from 'react-native-vector-icons/FontAwesome5'

var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

export default class Main extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentUser: null,
      data: new Date().getDate,
      visible: false,
      name: '',
      description: '',              
      expire: '',
      selectedValue: '0',
      dateChanged: false
    }
    this.ref = firebase.firestore().collection('users')
    this.ref.where('email', "==", firebase.auth().currentUser.email).get().then(snap => {
      snap.forEach(doc => {
        this.userRef = doc
      })
    })
    this.update = this.update.bind(this)
  }


  componentDidMount() {
    const { currentUser } = firebase.auth()
    this.setState({ currentUser })
    this.update()
  }

  update = () => {
    let data
    firebase.firestore().collection('users')
      .where("email", "==", firebase.auth().currentUser.email).get().then((snap) => {
        snap.forEach((doc) => {
          data = doc.data()
          this.setState({
            data: data
          })
        })
      })
  }
  renderItem = ({ item }) => {
    return (
      <ListItem
        style={{ alignSelf: "stretch" }}
        title={item.descricao}
        subtitle={item.valor}
        bottomDivider
      />
    )

  }

  close() {
    this.setState({
      visible: false,
    })
  }

  open() {
    this.setState({
      visible: true
    })
  }

  handleComboboxChangeOption(val) {
    if (val !== '0') {
      this.setState({selectedValue: val});
    }
  }

  modalCallback(data){
    console.log(data)
    this.setState({
      visible: false
    })
    if(!this.userRef.data().debitos){
      let debArray = []
      debArray.push(data)
      this.userRef.ref.update({
        debitos: debArray
      }).then(() => {
        console.log("Added successfully")
        this.update()
    })
      .catch(e => console.log("ERROR: ", e))      
    } else{
      let debArray = [ ]
      debArray = this.userRef.data().debitos
      debArray.push(data)
      this.userRef.ref.update({
        debitos: debArray
      }).then(() => {
        console.log("Added successfully")
        this.update()
      })
      .catch(e => console.log("ERROR: ", e))
    }
  }

  render() {
    const { currentUser } = this.state

    let list = this.state.data ?
      <FlatList
        data={this.state.data.debitos}
        keyExtractor={(item, index) => index.toString()}
        renderItem={this.renderItem}
      />
      : <ActivityIndicator size="large" />

    return (
      <View style={styles.master}>
        <OverlayComponent 
          callback={this.modalCallback.bind(this)}
          visible={this.state.visible}    
        />
        <View style={styles.container}>
          <Text>
            Hi {currentUser && currentUser.email}!
          </Text>
        </View>
        <View style={styles.listContainer}>
          <Button onPress={this.open.bind(this)} 
            icon={{
              type: 'font-awesome', 
              name: 'plus-circle',
              color: "blue"
            }}
          />
          {list}
        </View>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  master: {
    flex: 1,
    alignSelf: 'center',
    flexDirection: 'column'
  },
  container: {
    flex: 1,
    alignSelf: 'flex-start',
    alignItems: 'center',
  },

  listContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    flexDirection: 'column-reverse',
    width: width * .95,
  }
})