import React, { Suspense, lazy } from 'react';
import { Route, Switch } from "react-router-dom";
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
      currentUser: {}
    };
    this.loginCurrentUser = this.loginCurrentUser.bind(this);
    this.logoutCurrentUser = this.logoutCurrentUser.bind(this);
    this.setCurrentUser = this.setCurrentUser.bind(this);
  }

  setCurrentUser() {
    //Auth.deauthenticateUser();
    if (Auth.isUserAuthenticated()) {
      this.loginCurrentUser().then((res) => {
        this.setState({
          isLoggedIn: true,
          currentUser: res.user
        });
      });
    }   
  }

  async loginCurrentUser() {
    try {  
      console.log('loginCurrentUser called');
      let request = new Request(`${appConfig.apiBaseUrl}/dashboard`, {
        method: 'GET',
        headers: new Headers({
          'Authorization': `Bearer ${Auth.getToken()}`
        })
      });
      let res = await fetch(request);
      let response = res.json();
      return response;
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
