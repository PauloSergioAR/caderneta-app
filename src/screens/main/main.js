import React from 'react'
import { StyleSheet, View, ActivityIndicator, Dimensions, StatusBar } from 'react-native'
import firebase from 'react-native-firebase';
import { ListItem, Button } from 'react-native-elements';

import LinearGradient from 'react-native-linear-gradient';

import OverlayComponent from '../../main/components/overlays/overlay'
import List from '../../main/components/list'
import Balanco from '../../main/components/balanco'

var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

export default class Main extends React.Component {
  static navigationOptions  = ({ navigation }) => {
    return (
      {
        headerLeft: () => (
          <Button
            type="clear"
            onPress={() => firebase.auth().signOut()}
            icon={{ type: 'simple-line-icon', name: 'logout', color:'white' }}
          />
        ),
        headerRight: () => (
          <Button
            type="clear"
            onPress={() => navigation.getParam('gotoSearch')()}
            icon={{type: "ionicon", name: "md-search", color: 'white', size: height * 0.03}}
          />
        ),
    
        headerTransparent: true
      }
    )
  }

  constructor(props) {
    super(props)
    this.state = {
      currentUser: null,
      visible: false,
      dados: null,
      updating: false,
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height
    }

    this.ref = firebase.firestore().collection('users')
    this.ref.where('email', "==", firebase.auth().currentUser.email).get().then(snap => {
      snap.forEach(doc => {
        this.userRef = doc        
      })            
    })
    
    this.update = this.update.bind(this)

    firebase.firestore().collection('users').
      where('email', '==', firebase.auth().currentUser.email)
      .onSnapshot(
        {
          includeMetadataChanges: true
        },
        this.update
      )

    this.itemCallback = this.itemCallback.bind(this)    

    Dimensions.addEventListener('change', this.onDimensionsChange.bind(this))
  }

  onDimensionsChange(){
    this.setState({
      ...this.state,
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height
    })

    width = Dimensions.get('window').width,
    height = Dimensions.get('window').height
  }

  componentDidMount() {
    const { currentUser } = firebase.auth()
    this.setState({ currentUser })
    this.update()

    this.props.navigation.setParams({
      gotoSearch: this.gotoSearch.bind(this)
    })
  }

  gotoSearch(){
    this.props.navigation.navigate('SearchScreen', {
      list: this.state.dados.debitos,
      docRef: this.userRef
    })
  }

  update = () => {
    this.setState({updating: true})    
    let data
    firebase.auth().currentUser && firebase.firestore().collection('users')
      .where("email", "==", firebase.auth().currentUser.email).get().then((snap) => {
        snap.forEach((doc) => {
          data = doc.data()
          this.setState({
            dados: data
          })
          this.userRef = doc
        })
      }).catch(e => console.log(e))    
    this.setState({updating: false})
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
        leftIcon={{ type: 'evilicon', name: 'user' }}
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

    return itemRet ? itemRet : false
  }

  itemCallback(name) {
    this.props.navigation.navigate('UserScreen', {
      name: name,
      docRef: this.userRef,    
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
        console.log('user existe')
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
          if (u.nome === usr.nome) {
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

  excluir(i) {
    console.log(i)
    let array = this.userRef.data().debitos
    let newdebitosArray = []

    array.forEach((item, index) => {
      if (index != i) {
        console.log("pushing " + item.nome)
        newdebitosArray.push(item)
      }
    })
    console.log(newdebitosArray)
    this.userRef.ref.update({
      debitos: newdebitosArray
    }).then(() => this.update())
      .catch(e => console.log(e.message))
  }

  render() {

    let load = this.state.updating ? 
    <ActivityIndicator style={{ alignSelf: "center" }} color="#f5f5f5" size="large"/> :
    <></>

    let view
    if (this.state.dados && !this.state.dados.debitos) {
      console.log("sem lista")
      view =
        <>
          <View style={styles.top}>
            <OverlayComponent
              callback={this.modalCallback.bind(this)}
              visible={this.state.visible}
            />
            <View style={styles.container}>
              <Balanco valor={0} showBal={false} />
            </View>
            {load}
          </View>
          <View style={styles.listContainer}>
            <Button
              type="clear"
              icon={{ type: 'material-community', name: 'plus-circle-outline', size: 40 }}
              onPress={() => this.open()}
              buttonStyle={{ height: 70, width: 70, alignSelf: 'flex-end' }}
            />
          </View>
        </>
    } else if (this.state.dados && this.state.dados.debitos) {      
      let value = 0;
      this.state.dados.debitos.forEach((item) => {
        item.contas.forEach((conta) => {
          if (!conta.quitado)
            value = conta.tipo == 'receber' ? value + conta.valor : value - conta.valor
        })
      })

      view =
        <>
          <View style={styles.master}>
            <View style={styles.top}>
              <OverlayComponent
                callback={this.modalCallback.bind(this)}
                visible={this.state.visible}
              />
              <View style={styles.container}>
                <Balanco valor={value} showBal={false} />
              </View>              
            </View>
            <View style={styles.listContainer}>              
              <List  data={this.state.dados.debitos} itemCallback={this.itemCallback} excluir={this.excluir.bind(this)} />
              <Button                
                type="clear"
                icon={{ type: 'material-community', name: 'plus-circle-outline', size: 40 }}
                onPress={() => this.open()}
                buttonStyle={{ height: 70, width: 70, marginBottom: 50, flex:.05, alignSelf: 'flex-end' }}
              />
            </View>
          </View>
        </>
    } else {
      console.log('carregando')
      view =
        <View style={styles.loading}>
          <ActivityIndicator style={{ alignSelf: "center" }} color="#f5f5f5" size="large" />
        </View>
    }

    return (
      <LinearGradient
        colors={['#9831F7', '#00C9E1']}
        style={{ flex: 1 }}
        start={{ x: 0.7, y: 0.7 }}
        useAngle={true}
        angle={90}
        angleCenter={{ x: 0.3, y: 0.3 }}
      >
        <StatusBar barStyle="light-content" backgroundColor="#0CA2F7" />        
        {view}        
      </LinearGradient>
    )
  }
}

const styles = StyleSheet.create({
  loading:{
    flex: 1,
    alignSelf: 'center',
    flexDirection: 'column',
    justifyContent: 'center'
  },

  master: {
    flex: 1,
    alignSelf: 'center',
    flexDirection: 'column',
  },

  top: {
    flexDirection: 'column',
    flex: .20,    
    marginTop: height * 0.03,
    marginBottom: height * 0.02    
  },
  
  container: {
    flex: 1,
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: 50,
    marginBottom: 20
  },

  listContainer: {
    flex: .80,
    justifyContent: 'space-around',
    flexDirection: 'column',
    width: width * .95,    
    backgroundColor: '#f5f5f5',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    elevation: 10,
  },

  list: {    
    flex: .50
  },  
})