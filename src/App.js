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
      
    </div>
  );
}

//export default App;
export default withAuthenticator(App);
