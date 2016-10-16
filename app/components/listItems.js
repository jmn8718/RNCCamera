import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ListView,
} from 'react-native';

import Item from './item';

export default class ListItems extends Component {

  render() {
    const { dataSource } = this.props;
    return (
      <ListView
        dataSource={dataSource}
        renderRow={rowData => <Item doc={rowData} />}
        style={styles.container}
        enableEmptySections
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F0F',
    alignSelf: 'stretch',
  },
});
