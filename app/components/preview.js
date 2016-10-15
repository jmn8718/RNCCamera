import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
} from 'react-native';

export default class Preview extends Component {

  componentWillMount() {

  }
  render() {
    const { image, onSave, saving } = this.props;

    return (
      <View style={styles.container}>
        <Image
          style={{width: 250, height: 250}}
          source={this.props.image}
        />
        <TouchableHighlight onPress={onSave}>
          <Text style={styles.instructions}>
            SAVE
          </Text>
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 250,
    height: 250,
    borderRadius: 5,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
