import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
} from 'react-native';

export default class Item extends Component {

  render() {
    const { doc } = this.props;

    return (
      <View style={styles.container}>
        <Image
          style={styles.image}
          source={{ uri: doc.image.uri }}
        />
        <View style={styles.infomation}>
          <Text>TYPE: {doc.type}</Text>
          <Text>TS: {doc.timestamp}</Text>
          <Text>ACTION: {doc.action}</Text>
          <Text>TYPE: {doc.uri}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 4,
    padding: 8,
    backgroundColor: 'whitesmoke',
    borderRadius: 5,
  },
  image: {
    width: 75,
    height: 75,
    borderRadius: 5,
  },
  information: {
    flex: 1,
    flexDirection: 'column',
    margin: 4,
  },
});
