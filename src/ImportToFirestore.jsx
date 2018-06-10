import React from 'react';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

import firebase from 'firebase/app';

import injectTapEventPlugin from 'react-tap-event-plugin';



class ImportToFirestore extends React.Component {
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
    if (!this.state.json) {
      return;
    }
    let ref = undefined;
    let url = this.state.url;
    let obj = this.state.json;

    var arr = url.split('/');
    if(arr.length % 2 === 1){
      ref = this.state.db.doc(this.state.url);
      console.log(ref);
      ref.set(obj).then((resp)=>{
        console.log(resp);
      }).catch((e)=>{
        console.log(e);
      });
    }
    else {
      ref = this.state.db.collection(this.state.url);
      console.log(ref);
      ref.add(obj).then((resp)=>{
        console.log(resp);
      }).catch((e)=>{
        console.log(e);
      });
    }



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
            onChange={::this.onChangeJson}
            inputStyle = {this.state.style}
            value={this.state.displayJson}
          />
        </div>
        <div>
          <FlatButton
            label="Submit"
            primary={true}
            onClick={::this.submit}
          />
          <FlatButton
            label="Pretty"
            primary={true}
            onClick={::this.pretty}
          />
        </div>
      </div>
      </MuiThemeProvider>
    );
  }
}


export default ImportToFirestore
