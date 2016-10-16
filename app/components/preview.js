import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Image,
} from 'react-native';

import { Button, Subheader } from 'react-native-material-design';

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
        {!saving ?
          <Button
            text="SAVE"
            raised={true}
            onPress={onSave}
          /> :
          <Subheader text="SAVING ..."/>
        }
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
    width: 30,
    height: 350,
    borderRadius: 5,
  },
});
