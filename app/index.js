import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  NativeModules,
  Image,
  ListView,
} from 'react-native';

const camera = NativeModules.CameraModule;

import {
  manager,
  ReactCBLite,
} from 'react-native-couchbase-lite';

const SG_URL = '10.111.4.12:4984';
const DB_NAME = 'db';

let database;

export default class App extends Component {

  constructor() {
    super();
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      image: undefined,
      error: undefined,
      dataSource: ds.cloneWithRows([]),
    }
  }

  componentDidMount() {
    ReactCBLite.init(url => {
      database = new manager(url, DB_NAME);
      database.createDatabase()
        .then(res => {
          const REPLICATION_OPTIONS = {
            continuous: true,
          };
          database.replicate(`http://${SG_URL}/${DB_NAME}`, DB_NAME, REPLICATION_OPTIONS);
          database.getInfo()
            .then(res => {
              database.listen({
                since: res.update_seq - 1,
                feed: 'longpoll',
              });
              database.changesEventEmitter.on('changes', function (e) {
                this.setState({sequence: e.last_seq});
              }.bind(this));
            })
            .catch(e => console.log('ERROR INFO', e))
        })
        .then(() => database.getDocuments({include_docs: true}))
        .then(res => this.setState({
          dataSource: this.state.dataSource.cloneWithRows(res.rows.map(row => row.doc).filter(doc => doc.type === 'id')),
        }))
        .catch(e => console.log('ERROR', e));
    })
  }

  onTakePicture = () => {
    camera.takePicture()
      .then(data => this.setState({
          image: {
            uri: `file://${data.uri}`
          },
        })
      )
      .catch(error => this.setState({ error }));
  }

  onSaveDoc = () => {
    console.log('SAVE', this.state.image)
    const doc = {
      type: 'id',
      image: this.state.image,
    }
    database.createDocument(doc)
      .then(data => console.log('DATA', data))
      .catch(error => console.log('ERROR', error));
  }

  renderDoc = doc => <Image style={{width: 50, height: 50}} source={doc.image} />;

  render() {
    return (
      <View style={styles.container}>
        <TouchableHighlight onPress={this.onTakePicture}>
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
        {this.state.image &&
          <TouchableHighlight onPress={this.onSaveDoc}>
            <Text style={styles.welcome}>
              SAVE
            </Text>
          </TouchableHighlight>
        }
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderDoc}
          style={styles.listView}
          enableEmptySections
        />
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
