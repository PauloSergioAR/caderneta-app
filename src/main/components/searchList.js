import React, { Component } from 'react';
import { View, FlatList, Dimensions, StyleSheet } from 'react-native';

import { ListItem, Button, SearchBar } from 'react-native-elements';

var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

const SearchList = (props) => {

  function renderItens (item , index)  {        
    return (      
      <ListItem          
          ref={React.createRef()}
          style={styles.list}
          leftIcon={{ type: 'evilicon', name: 'user' }}
          title={item.nome}
          onPress={() => props.searchItemCallback(item.nome)}                  
      />      
    )
  }

  return (
    <View>
      <FlatList
        data={props.data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item, index, separators}) => renderItens(item, index)}
        style={{ flexGrow: 0, height: height * .68 }}
      />
    </View>
  )
};

export default SearchList;

const styles = StyleSheet.create({
  listPositive: {
    color: 'green'
  },

  listNegative: {
    color: 'red'
  },

  list: { 
    alignSelf: "stretch", 
    marginBottom: 2, 
    marginLeft: 10, 
    marginRight: 10, 
    borderRadius: 100, 
    elevation: 10, 
    marginTop: height * 0.01
  }
})