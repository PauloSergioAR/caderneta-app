import React, { Component } from 'react';

import { View, Text } from 'react-native';
import { SearchBar, Button } from 'react-native-elements';

import SearchList from '../../main/components/searchList'
import _ from "lodash"

export default class Search extends Component {  
  static navigationOptions  = ({ navigation }) => {
    return (
      {        
        headerTitle: <SearchBar 
                        onChangeText={text => navigation.getParam('search')(text)}
                        value={navigation.getParam('value')}
                        placeholder="Procurar..."
                        lightTheme={true} round={true}
                        containerStyle={{flex: 1, width: '100%', backgroundColor: 'white'}}
                        inputStyle={{backgroundColor: '#f5f5f5'}}
                        inputContainerStyle={{backgroundColor: '#f5f5f5'}}
                        />
      }
    )
  }

  constructor(props){
    super(props)
    this.state = {
      query: '',
      list: this.props.navigation.getParam('list'),
      filteredList: this.props.navigation.getParam('list'),
    }    
  }

  componentDidMount(){        
    this.props.navigation.setParams({
      search: this.search.bind(this),
      value: ''
    })
  }
  
  search(text){      

    this.props.navigation.setParams({      
      value: text
    })

    const formatQuery = text.toLowerCase()

    const data = _.filter(this.state.list, (user, index) => {      
      if(user.nome.includes(text) || user.nome.toLowerCase().includes(text)){        
        return user
      }      
    })
    
    this.setState({
      filteredList: data
    })
  }

  searchItemCallback(nome){
    let docRef = this.props.navigation.getParam("docRef", '')
    this.props.navigation.navigate('UserScreen', {
      name: nome,
      docRef: docRef
    })
  }

  render() {
    return (
      <View>
        <SearchList data={this.state.filteredList} searchItemCallback={this.searchItemCallback.bind(this)} />
      </View>
    );
  }
}
