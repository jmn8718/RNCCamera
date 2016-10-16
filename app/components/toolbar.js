import React, { Component } from 'react';

import { Toolbar as MaterialToolbar } from 'react-native-material-design';

export default class Toolbar extends Component {

    render() {
      const { title, onIconPress } = this.props;
      return (
        <MaterialToolbar
          title={title}
          actions={[{
            icon: 'add',
            onPress: onIconPress
          }]}
          rightIconStyle={{
            margin: 10
          }}
        />
      );
    }
}
