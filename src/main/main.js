import React, {useEffect} from 'react'
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
  static navigationOptions = {
    title: 'Home',
    headerLeft: () => (
      <Button
        onPress={() => firebase.auth().signOut()}
        icon={{ type: 'simple-line-icon', name: 'logout' }}
      />
    ),
    headerRight: () => (
      <Button
        onPress={() => console.log("Searched")}
        icon={{ type: 'material-community', name: 'account-search' }}
      />
    )
  }

  constructor(props) {
    super(props)
    this.state = {
      currentUser: null,
      visible: false,
      name: '',
      description: '',
      expire: '',
      selectedValue: '0',
      dateChanged: false,
      dados: null
    }

    this.ref = firebase.firestore().collection('users')
    this.ref.where('email', "==", firebase.auth().currentUser.email).get().then(snap => {
      snap.forEach(doc => {
        this.userRef = doc
      })
    })
    this.update = this.update.bind(this)
    this.searchCallback = this.searchCallback.bind(this)

    this.interval = setInterval(() =>{
      this.update()
      console.log("Fall here")
    }, 60000)
  }

  searchCallback(text) {
    console.log("searched: ", text)
  }

  componentDidMount() {
    const { currentUser } = firebase.auth()
    this.setState({ currentUser })
    this.update()

  }

  update = () => {
    
    console.log("Updating")
    let data
    firebase.firestore().collection('users')
      .where("email", "==", firebase.auth().currentUser.email).get().then((snap) => {
        snap.forEach((doc) => {
          data = doc.data()

          this.setState({
            dados: data
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
      this.setState({ selectedValue: val });
    }
  }

  modalCallback(data) {
    this.setState({
      visible: false
    })
    if (!this.userRef.data().debitos) {
      let debArray = []
      debArray.push(data)
      this.userRef.ref.update({
        debitos: debArray
      }).then(() => {
        console.log("Added successfully")
        this.update()
      })
        .catch(e => console.log("ERROR: ", e))
    } else {
      let debArray = []
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
    let view
    if (this.state.dados) {
      let value = 0;
      this.state.dados.debitos.forEach((item) => {
        console.log(value)
        value = value + parseFloat(item.valor)
      })

      view =
        <> 
          <View style={styles.top}>
            <OverlayComponent
              callback={this.modalCallback.bind(this)}
              visible={this.state.visible}
            />
            <View style={styles.container}>
              <Text>Balanço</Text>
              <Text style={value > 0 ? styles.positive : styles.negative}>              
                R$ {value}
              </Text>
            </View>
          </View>
          <View style={styles.listContainer}>
            
            <FlatList
                data={this.state.dados.debitos}
                keyExtractor={(item, index) => index.toString()}
                renderItem={this.renderItem}
                style={{flexGrow: 0, height: height * .80}}              
              />
          </View>
        </>
    } else {
      view = 
        <>
          <ActivityIndicator size="large" />
        </>
    }    

    return (
      <View style={styles.master}>
        {view}
      </View>
    )
  }
}
const styles = StyleSheet.create({
  master: {
    flex: 1,
    alignSelf: 'center',
    flexDirection: 'column',    
  },
  top: {
    height: height * .15
  },
  container: {
    flex: 1,
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: 40
  },

  listContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    flexDirection: 'column-reverse',
    width: width * .95,
    height: 5000,
    
  },
  positive:{
    fontSize: 40,
    fontWeight: 'bold',
    color: 'green'
  },
  negative: {
    fontSize: 40,    
    fontWeight: 'bold',
    color:'red'
  }
})