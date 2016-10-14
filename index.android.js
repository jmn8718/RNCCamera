/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  NativeModules,
  Image,
} from 'react-native';

const camera = NativeModules.CameraModule;

export default class RNCamera extends Component {

  constructor() {
    super();
    this.state = {
      uri: undefined,
    }
  }
  _onPressButton = () => {
    camera.takePicture()
      .then((data) => {
        console.log(data)
        this.setState({ uri: `file://${data.uri}` })
      })
      .catch((e) => console.log(e));
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to React Native!
        </Text>
        <TouchableHighlight onPress={this._onPressButton}>
          <Text style={styles.welcome}>
            PHOTO
          </Text>
        </TouchableHighlight>
        <Text>{this.state.uri ? this.state.uri : 'no'}</Text>
        {this.state.uri &&
          <Image
            style={{width: 250, height: 250}}
            source={{ uri: this.state.uri }}
          />
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('RNCamera', () => RNCamera);
