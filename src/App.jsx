// React core.
import React from 'react';
import ReactDOM from 'react-dom';

// Firebase.
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import ImportToFirestore from "./ImportToFirestore.jsx"
import ExportFromFirestore from "./ExportFromFirestore.jsx"

// Get the Firebase config from the auto generated file.
const firebaseConfig = require('./firebase-config.json').result;

// Instantiate a Firebase app.
const firebaseApp = firebase.initializeApp(firebaseConfig);

class App extends React.Component {

  state = {
    isSignedIn: undefined,
  };


  componentDidMount() {
    this.unregisterAuthObserver = firebaseApp.auth().onAuthStateChanged((user) => {
      this.setState({isSignedIn: !!user});
    });
  }


  componentWillUnmount() {
     this.unregisterAuthObserver();
  }

  render() {
    return (
           <ImportToFirestore/>
    );
  }
  // render() {
  //   return (
  //          <ExportFromFirestore/>
  //   );
  // }
}

// Load the app in the browser
ReactDOM.render(<App/>, document.getElementById('app'));
