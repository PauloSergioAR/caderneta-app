import React, { useEffect, useState } from 'react'
import { StyleSheet, Platform, Image, Text, View, ActivityIndicator, FlatList, Dimensions, Picker } from 'react-native'
import firebase from 'react-native-firebase';
import { ListItem, Overlay, Button, Input, SearchBar } from 'react-native-elements';

import DatePicker from 'react-native-datepicker'
import Menu, { MenuItem, MenuDivider, Position } from "react-native-enhanced-popup-menu";

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
        type="clear"
        onPress={() => firebase.auth().signOut()}
        icon={{ type: 'simple-line-icon', name: 'logout' }}
      />
    ),
    headerRight: () => (
      <Button
        type="clear"
        onPress={() => this.prototype.props.navigation.setParams({
          headerRigh: () => {
            <SearchBar
              placeholder="Type Here..."
              onChangeText={this.updateSearch}
              value={"Test"}
            />
          }
        })}
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

    this.interval = setInterval(() => {
      this.update()      
    }, 60000)
    this.showMenu = this.showMenu.bind(this)
  }

  setMenuRef = ref => this.menuRef = ref
  hideMenu = () => this.menuRef.hide();
  showMenu = (ref) => {    
    this.menuRef.show(ref, stickTo = Position.BOTTOM_CENTER);
  }

  searchCallback(text) {    
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
          console.log("Received")          
        })
      }).catch(e => console.log(e))            
  }
  renderItem = ({ item }, i) => {
    let value = 0;
    item.contas.forEach((c) => {
      value = value + c.valor
    })

    title = "R$ " + value.toFixed(2)

    return (
      <ListItem
        ref={React.createRef()}
        style={{ alignSelf: "stretch" }}
        leftIcon={{type:'evilicon', name: 'user'}}
        title={item.nome}
        rightTitle={title}
        rightTitleStyle={value > 0 ? styles.listPositive : styles.listNegative}       
        bottomDivider={true}
        topDivider={true}
        
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

  getByName(arr, text) {    
    let itemRet
    arr.forEach((item) => {    
      if (item.nome === text) {    
        itemRet = item
      }
    })
    
    return itemRet ?  itemRet :  false
  }

  modalCallback(data) {
    this.setState({
      visible: false
    })
    if (data) {      
      if (!this.userRef.data().debitos) {
        console.log("Debitos melhor n existe")
        let debArray = []        
        this.userRef.ref.update({
          debitos: debArray
        }).then(() => {
          console.log("Added successfully")
          this.update()
        })
          .catch(e => console.log("ERROR: ", e))
      }

      let usr = this.getByName(this.userRef.data().debitos, data.nome)
      
      if (usr) {
        console.log('user exite')       
        let arr = []
        arr = usr.contas
        let deb = this.userRef.data().debitos

        arr.push({
          categoria: data.categoria,
          date: data.date,
          descricao: data.descricao,
          tipo: data.tipo,
          valor: data.valor
        })
        usr = {
          ...usr,
          contas: arr
        }
        deb.forEach((u, i, a) => {
          if(u.nome === usr.nome){
            a[i] = usr
          }
        })
        this.userRef.ref.update({
          debitos: deb
        }).then(() => {
          console.log("Added successfully")
          this.update()
        })
          .catch(e => console.log("ERROR: ", e))
      } else {
        console.log("user n existe")
        let usr = {
          nome: data.nome,
          contas: [
            {
              categoria: data.categoria,
              date: data.date,
              descricao: data.descricao,
              tipo: data.tipo,
              valor: data.valor
            },
          ]
        }

        let arr = this.userRef.data().debitos
        arr.push(usr)

        this.userRef.ref.update({
          debitos: arr
        }).then(() => {
          console.log("Added successfully")
          this.update()
        })
          .catch(e => console.log("ERROR: ", e))
      }     
    }
  }

  render() {    
    let view
    if (this.state.dados) {
      let value = 0;
      this.state.dados.debitos.forEach((item) => {
        item.contas.forEach((conta) =>{          
          value = value + conta.valor
        })                
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
                R$ {value.toFixed(2)}
              </Text>
            </View>
          </View>
          <View style={styles.listContainer}>
            <Button
              type="clear"
              icon={{ type: 'material-community', name: 'plus-circle-outline' }}
              onPress={() => this.open()}
            />
            <FlatList
              data={this.state.dados.debitos}
              keyExtractor={(item, index) => index.toString()}
              renderItem={this.renderItem}
              style={{ flexGrow: 0, height: height * .80 }}
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
        <Menu ref={this.setMenuRef}>
          <MenuItem onPress={this.hideMenu}>Item</MenuItem>
        </Menu>
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
  positive: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'green'
  },
  negative: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'red'
  },
  listPositive:{
    color: 'green'
  },
  listNegative:{
    color: 'red'
  }
})