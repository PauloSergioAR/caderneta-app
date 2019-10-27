import React from 'react';

import { Text, StyleSheet } from 'react-native';

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
    fontSize: 40,
    fontWeight: 'bold',
    color: 'green'
  },
  negative: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'red'
  },  
})

export default Balanco