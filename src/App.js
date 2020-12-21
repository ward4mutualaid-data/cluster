import logo from './logo.svg';
import './App.css';
import React from 'react';
import Amplify, { Auth } from 'aws-amplify';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import awsconfig from './aws-exports';

Amplify.configure(awsconfig);

function App() {
  return (
    <div className="App">
     <AmplifySignOut />
      <h1>You've successfuly logged in! </h1>
      <p>There is nothing here yet but stay tuned ...</p>
      <img></img>
      <img src="welp_its_cats.gif" alt="cats" />
    </div>
  );
}

//export default App;
export default withAuthenticator(App);
