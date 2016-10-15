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

import Item from './components/item';
import Preview from './components/preview';

import {
  manager,
  ReactCBLite,
} from 'react-native-couchbase-lite';

const SG_URL = '10.111.4.12:4984';
const DB_NAME = 'db';

const DOC_TYPE = 'expense';

let database;

export default class App extends Component {

  constructor() {
    super();
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      image: undefined,
      error: undefined,
      capturing: false,
      saving: false,
      data: [],
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
          database.replicate(DB_NAME, `http://${SG_URL}/${DB_NAME}`, REPLICATION_OPTIONS);
          database.getInfo()
            .then(res => {
              database.listen({
                since: res.update_seq - 1,
                feed: 'longpoll',
              });
              database.changesEventEmitter.on('changes', function (e) {
                this.setState({sequence: e.last_seq});
                console.log(e);
                this.getDocuments();
              }.bind(this));
            })
            .catch(e => console.log('ERROR INFO', e))
        })
        .then(() => this.getDocuments())
        .catch(e => console.log('ERROR', e));
    })
  }

  getDocuments = () => {
    console.log('get the docs')
    database.getDocuments({include_docs: true})
      .then(res => {
        const data = res.rows
          .filter(row => row.doc.type === DOC_TYPE && row.doc._attachments && row.doc.timestamp)
          .map(row => {
            const doc = row.doc;
            const uri = database.getAttachmentUri(doc._id, 'photo');
            doc.uri = uri;
            return doc;
          })
          .sort((a, b) => a.timestamp < b.timestamp)
        this.setState({
          data,
          dataSource: this.state.dataSource.cloneWithRows(data),
        })
      })
      .catch(e => console.log('ERROR', e));
  }

  onTakePicture = () => {
    if (!this.state.capturing) {
      this.setState({ capturing: true });
      camera.takePicture()
        .then(data => this.setState({
            image: {
              uri: `file://${data.uri}`,
              path: data.uri,
            },
            capturing: false,
          })
        )
        .catch(error => this.setState({
          error,
          capturing: false,
        }));
    }
  }

  onSaveDoc = () => {
    if (!this.state.saving) {
      this.setState({ saving: true });
      const doc = {
        type: DOC_TYPE,
        image: this.state.image,
        timestamp: Date.now(),
        action: 'waiting',
      }
      database.createDocument(doc)
        .then(doc => {
          database.saveAttachment(doc.id, doc.rev, 'photo', this.state.image.uri, 'image/jpg');
        })
        .then(() => {
          this.setState({
            saving: false,
            image: undefined,
          });
        })
        .catch(error => this.setState({
          saving: false,
          error,
        }));
    }
  }

  render() {
    return (
      <View style={styles.container}>
        {!this.state.capturing &&
          <TouchableHighlight onPress={this.onTakePicture}>
            <Text style={styles.welcome}>
              TAKE A PHOTO
            </Text>
          </TouchableHighlight>
        }
        {this.state.image && !this.state.saving &&
          <Preview
            image={this.state.image}
            onSave={this.onSaveDoc}
          />
        }
        <ListView
          dataSource={this.state.dataSource}
          renderRow={rowData => <Item doc={rowData} />}
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
  listView: {
    alignSelf: 'stretch',
  }
});
