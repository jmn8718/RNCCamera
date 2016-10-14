import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  NativeModules,
  Image,
} from 'react-native';

const camera = NativeModules.CameraModule;

export default class App extends Component {

  constructor() {
    super();
    this.state = {
      image: undefined,
    }
  }
  _onPressButton = () => {
    camera.takePicture()
      .then((data) => {
        this.setState({
          image: {
            uri: `file://${data.uri}`
          },
        });
      })
      .catch((e) => console.log(e));
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableHighlight onPress={this._onPressButton}>
          <Text style={styles.welcome}>
            TAKE A PHOTO
          </Text>
        </TouchableHighlight>
        {this.state.image &&
          <Image
            style={{width: 250, height: 250}}
            source={this.state.image}
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
