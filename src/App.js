import React, { Suspense, lazy } from 'react';
import { Route, Switch } from "react-router-dom";
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';
import Loading from './components/Loading/Loading';
import Auth from "./modules/Auth";
import appConfig from './configuration.js';
import Navigation from './components/Navigation/Navigation';

const Landing = lazy(() => import('./components/Landing'));
const Login   = lazy(() => import('./components/Login'));

function WaitForComponent(Component, state) {
  return props => (
    <ErrorBoundary>
      <Suspense fallback={<div><Loading /></div>}>
        <Component {...state}/>
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
      redirectHome: false
    };
  }

  async loginCurrentUser() {
    try {  
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
    //Auth.deauthenticateUser();
    if (Auth.isUserAuthenticated()) {
      this.loginCurrentUser()
      .then((res) => {
        this.setState({
          isLoggedIn  : true, 
          currentUser : res.user
        });
      });
    }
  }

  render() {
    return (
      <div className="App">
        <Navigation 
          {...this.state} 
          logoutCurrentUser={this.logoutCurrentUser} 
        />
        <main>
          <Switch>
            <Route path="/login" exact component={WaitForComponent(Login, this.state)}/>
            <Route path="/" exact component={WaitForComponent(Landing, this.state)}/>
          </Switch>
        </main>
      </div>
    );
  }
}

export default App;
