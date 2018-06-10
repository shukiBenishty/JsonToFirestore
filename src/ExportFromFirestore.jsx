import React from 'react';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

import firebase from 'firebase/app';

import injectTapEventPlugin from 'react-tap-event-plugin';



class ExportFromFirestore extends React.Component {
  state = {
    db: undefined,
    url: "/",
    displayJson: undefined,
    style: {direction:'ltr'},
    valid: true
  };

  componentDidMount() {
    this.state.db = firebase.firestore()
  }

  onChangeUri = (event, value) => {
    this.setState({
      url: value
    });
  };

  onChangeJson = (event, value) => {
    try {
      let json = JSON.parse(value)
      this.setState({
        displayJson: value,
        valid: true,
        json: json,
        style:{
         direction:'ltr'
      }});
    } catch (e) {
      this.setState({
        displayJson: value,
        valid: false,
        json: undefined,
        style:{
         direction:'ltr',
         backgroundColor: '#ffd699'
      }});
    }

  };

  pretty(){
    this.setState({
      displayJson: JSON.stringify(this.state.json, null, 2)
    })
  }

  submit(){
    let ref = undefined;
    let url = this.state.url;
    let data = {};
    data[this.state.url] = {};

    var arr = url.split('/');
    if(arr.length % 2 === 1){
      ref = this.state.db.doc(this.state.url);
      ref.get()
      .then( doc => {
          data[this.state.url] = doc.data();
          let displayJson = (doc.exists) ? JSON.stringify(data, null, 2) : undefined
          this.setState({
            displayJson: displayJson
          });
        }).catch(error => {
          console.log(error);
          this.setState({
            displayJson: undefined
          });
        })
    }
    else {
      ref = this.state.db.collection(this.state.url);
      ref.get()
      .then(snapshot => {
          snapshot.forEach(doc => {
            data[this.state.url][doc.id] = doc.data();
          });
          this.setState({
            displayJson: JSON.stringify(data, null, 2)
          });
        })
        .catch(error => {
          console.log(error);
          this.setState({
            displayJson: undefined
          });
        })
      }
    console.log(ref);
  }

  componentWillMount(){
      injectTapEventPlugin();
  }

  render() {

    return (
      <MuiThemeProvider muiTheme={getMuiTheme()}>
      <div>
        <div>
          <TextField
            hintText="Insert uri"
            floatingLabelText="Uri"
            onChange={::this.onChangeUri}
          />
        </div>
        <div>
          <TextField
            hintText="Pest your json hear"
            floatingLabelText="Json"
            multiLine={true}
            rowsMax={20}
            disabled={true}
            onChange={::this.onChangeJson}
            inputStyle = {this.state.style}
            value={this.state.displayJson}
            fullWidth={!!this.state.displayJson}
          />
        </div>
        <div>
          <FlatButton
            label="Export"
            primary={true}
            onClick={::this.submit}
          />

        </div>
      </div>
      </MuiThemeProvider>
    );
  }
}


export default ExportFromFirestore
