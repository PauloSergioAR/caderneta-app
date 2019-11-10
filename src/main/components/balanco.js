import React from 'react';

import { Text, StyleSheet, Dimensions } from 'react-native';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

const Balanco = (props) => {
  
  return(
    <>
      {props.showBal &&  <Text>Balanço</Text>}
      <Text style={props.valor > 0 ? styles.positive : styles.negative}>
        R$ {props.valor.toFixed(2)}
      </Text>
    </>
  )
};

const styles = StyleSheet.create({
  positive: {
    fontSize: RFPercentage(5),
    fontWeight: 'bold',
    color: 'white'
  },
  negative: {
    fontSize: RFPercentage(5),
    fontWeight: 'bold',
    color: 'white'
  },  
})

export default Balanco