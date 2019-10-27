import React from 'react'
import { StyleSheet, Text, View, ActivityIndicator, FlatList, Dimensions } from 'react-native'
import firebase from 'react-native-firebase';
import { ListItem, Button, SearchBar } from 'react-native-elements';

import Menu, { MenuItem, Position } from "react-native-enhanced-popup-menu";

import OverlayComponent from './overlay'
import List from './components/list'
import Balanco from './components/balanco'

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
      dados: null
    }

    this.ref = firebase.firestore().collection('users')
    this.ref.where('email', "==", firebase.auth().currentUser.email).get().then(snap => {
      snap.forEach(doc => {
        this.userRef = doc
      })
    })
   
    this.update = this.update.bind(this)    
    this.itemCallback = this.itemCallback.bind(this)
    this.interval = setInterval(() => {
      this.update()      
    }, 60000)
    
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

  getByName(arr, text) {    
    let itemRet
    arr.forEach((item) => {    
      if (item.nome === text) {    
        itemRet = item
      }
    })
    
    return itemRet ?  itemRet :  false
  }

  itemCallback(name){
    console.log(name)
    this.props.navigation.navigate('UserScreen', {
      name: name,
      docRef: this.userRef      
    })
  }

  modalCallback(data) {
    this.setState({
      visible: false
    })

    if (data) {      
      if (!this.userRef.data().debitos) {
        console.log("Debitos n existe")
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
          value = conta.tipo == 'receber' ? value + conta.valor : value - conta.valor
        })                
      })
      console.log(value)
      view =
        <>
          <View style={styles.top}>
            <OverlayComponent
              callback={this.modalCallback.bind(this)}
              visible={this.state.visible}
            />
            <View style={styles.container}>
              <Balanco valor={value} showBal={true}/>
            </View>
          </View>
          <View style={styles.listContainer}>
            <Button
              type="clear"
              icon={{ type: 'material-community', name: 'plus-circle-outline' }}
              onPress={() => this.open()}
            />
            <List data={this.state.dados.debitos} itemCallback={this.itemCallback}/>
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
  }  
})