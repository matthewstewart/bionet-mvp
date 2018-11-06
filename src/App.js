import React, { Suspense, lazy } from 'react';
import { Route, Switch } from "react-router-dom";
import Crypto from 'crypto-js';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';
import Loading from './components/Loading/Loading';
import Auth from "./modules/Auth";
import appConfig from './configuration.js';
import Navigation from './components/Navigation/Navigation';
import Footer from './components/Footer/Footer';
import Login from './components/Login';
import Signup from './components/Signup';

const Landing = lazy(() => import('./components/Landing'));
const LabProfile = lazy(() => import('./components/Lab/LabProfile'));

function WaitForComponent(Component, state, loginMethod) {
  return props => (
    <ErrorBoundary>
      <Suspense fallback={<div><Loading /></div>}>
        <Component {...state} {...props} loginCurrentUser={loginMethod}/>
      </Suspense>
    </ErrorBoundary>
  );
}

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      currentUser: {},
      labs: []
    };
    this.loginCurrentUser = this.loginCurrentUser.bind(this);
    this.logoutCurrentUser = this.logoutCurrentUser.bind(this);
    this.setCurrentUser = this.setCurrentUser.bind(this);
    this.getCurrentUserLabs = this.getCurrentUserLabs.bind(this);
  }

  getCurrentUserLabs(currentUser) {
    this.getLabs()
    .then((res) => {
      //console.log('getCurrentUserLabs.res', res);
      let labs = res.data;
      console.log('currentUser', currentUser);
      //console.log('labs', labs);
      currentUser['labs'] = [];
      currentUser['labsRequested'] = [];
      currentUser['labsToJoin'] = [];
      for(let i = 0; i < labs.length; i++) {
        let lab = labs[i];
        let labIsJoined = false;
        let labIsRequested = false;
        for(let j = 0; j < lab.users.length; j++) {
          let labUser = lab.users[j];
          if (labUser._id === currentUser._id){
            labIsJoined = true;
            currentUser.labs.push(lab);
          } 
        }
        for(let j = 0; j < lab.joinRequests.length; j++) {
          let joinRequest = lab.joinRequests[j];
          if (joinRequest._id === currentUser._id){
            labIsRequested = true;
            currentUser.labsRequested.push(lab);
          }
        }
        if (!labIsJoined && !labIsRequested) {
          currentUser.labsToJoin.push(lab);
        }
      }
      this.setState({
        isLoggedIn: true,
        currentUser,
        labs
      });
    });
  }

  async getLabs() {
    try {  
      let labsRequest = new Request(`${appConfig.apiBaseUrl}/labs`, {
        method: 'GET',
        headers: new Headers({
          'Authorization': `Bearer ${Auth.getToken()}`
        })
      });
      let labRes = await fetch(labsRequest);
      let labsResponse = labRes.json();
      return labsResponse;
    } catch (error) {
      console.log('App.getLabs', error);
    }   
  }

  setCurrentUser() {
    //Auth.deauthenticateUser();
    if (Auth.isUserAuthenticated()) {
      this.loginCurrentUser()
      .then((res) => {
        //console.log('setCurrentUser.res', res);
        let currentUser = res.user;
        currentUser['gravatarUrl'] = `https://www.gravatar.com/avatar/${Crypto.MD5(currentUser.email).toString()}?s=100`;
        //console.log('currentUser: ', currentUser)
        this.getCurrentUserLabs(currentUser);
        // this.setState({
        //   isLoggedIn: true,
        //   currentUser
        // });
        // return currentUser;
      });
    }   
  }

  async loginCurrentUser() {
    try {  
      let userRequest = new Request(`${appConfig.apiBaseUrl}/dashboard`, {
        method: 'GET',
        headers: new Headers({
          'Authorization': `Bearer ${Auth.getToken()}`
        })
      });
      let userRes = await fetch(userRequest);
      let userResponse = userRes.json();
      //console.log('userResponse', userResponse);
      return userResponse;
    } catch (error) {
      console.log('App.loginCurrentUser', error);
    } 
  }

  logoutCurrentUser() {
    Auth.deauthenticateUser();
    this.setState({
      redirectHome: true,
      isLoggedIn: false,
      currentUser: {}
    });
  }

  componentDidMount() {
    this.setCurrentUser();
  }

  render() {
    return (
      <div className="App">
        <Navigation {...this.state} logoutCurrentUser={this.logoutCurrentUser}/>
        <main className="viewport-container">

          <Switch>
            <Route path="/labs/:labId" component={WaitForComponent(LabProfile, this.state)}/>
          </Switch>  

          <Switch>
            <Route path="/signup" exact render={(props) => (<Signup {...props} {...this.state}/>)}/>
            <Route path="/login" exact render={(props) => (<Login {...props} {...this.state} setCurrentUser={this.setCurrentUser}/>)}/>
            <Route path="/" exact component={WaitForComponent(Landing, this.state)}/>
          </Switch>

        </main>
        <Footer />
      </div>
    );
  }
}

export default App;
