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
const About = lazy(() => import('./components/About'));

const LabProfile = lazy(() => import('./components/Lab/LabProfile'));
const LabNew = lazy(() => import('./components/Lab/LabNew'));
const LabAdd = lazy(() => import('./components/Lab/LabAdd'));
const LabEdit = lazy(() => import('./components/Lab/LabEdit'));
const LabDelete = lazy(() => import('./components/Lab/LabDelete'));

const ContainerProfile = lazy(() => import('./components/Container/ContainerProfile'));
const ContainerAdd = lazy(() => import('./components/Container/ContainerAdd'));
const ContainerEdit = lazy(() => import('./components/Container/ContainerEdit'));
const ContainerDelete = lazy(() => import('./components/Container/ContainerDelete'));

function WaitForComponent(Component, state, refreshMethod) {
  return props => (
    <ErrorBoundary>
      <Suspense fallback={<Loading />}>
        <Component {...state} {...props} refresh={refreshMethod}/>
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
      labs: [],
      virtuals: [],
      physicals: []
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
      //console.log('currentUser', currentUser);
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
      this.getVirtuals()
      .then((res) => {
        //console.log('getVirtuals.res', res);
        let virtuals = res.data;
        this.getPhysicals()
        .then((res) => {
          this.setState({
            isLoggedIn: true,
            currentUser,
            labs,
            virtuals,
            physicals: res.data
          });
        });  
      })
    });
  }

  async getLabs() {
    try {  
      let labsRequest = new Request(`${appConfig.apiBaseUrl}/labs`, {
        method: 'GET',
        // headers: new Headers({
        //   'Authorization': `Bearer ${Auth.getToken()}`
        // })
      });
      let labRes = await fetch(labsRequest);
      let labsResponse = labRes.json();
      return labsResponse;
    } catch (error) {
      console.log('App.getLabs', error);
    }   
  }

  async getVirtuals() {
    try {  
      let virtualsRequest = new Request(`${appConfig.apiBaseUrl}/virtuals`, {
        method: 'GET',
        headers: new Headers({
          'Authorization': `Bearer ${Auth.getToken()}`
        })
      });
      let virtualRes = await fetch(virtualsRequest);
      let virtualsResponse = virtualRes.json();
      return virtualsResponse;
    } catch (error) {
      console.log('App.getVirtuals', error);
    }   
  }

  async getPhysicals() {
    try {  
      let physicalsRequest = new Request(`${appConfig.apiBaseUrl}/physicals`, {
        method: 'GET',
        headers: new Headers({
          'Authorization': `Bearer ${Auth.getToken()}`
        })
      });
      let physicalRes = await fetch(physicalsRequest);
      let physicalsResponse = physicalRes.json();
      return physicalsResponse;
    } catch (error) {
      console.log('App.getVirtuals', error);
    }   
  }

  setCurrentUser() {
    //Auth.deauthenticateUser();
    if (Auth.isUserAuthenticated()) {
      this.loginCurrentUser()
      .then((res) => {
        let currentUser = res.user;
        currentUser['gravatarUrl'] = `https://www.gravatar.com/avatar/${Crypto.MD5(currentUser.email).toString()}?s=100`;
        this.getCurrentUserLabs(currentUser);
      });
    } else {
      this.getVirtuals()
      .then((res) => {
        //console.log('getVirtuals.res', res);
        let virtuals = res.data;
        this.getPhysicals()
        .then((res) => {
          this.setState({
            virtuals,
            physicals: res.data
          });
        });  
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
    this.getLabs()
    .then((res) => {
      this.setState({
        labs: res.data
      });
    })
    this.setCurrentUser();
  }

  render() {
    //console.log('App.state', this.state);
    return (
      <div className="App">
        <Navigation {...this.state} logoutCurrentUser={this.logoutCurrentUser} getCurrentUserLabs={this.getCurrentUserLabs}/>
        <main className="viewport-container">

          <Switch>
            <Route path="/labs/new" exact component={WaitForComponent(LabNew, this.state, this.getCurrentUserLabs)}/>
            <Route path='/labs/:labId/add/:itemType' component={WaitForComponent(LabAdd, this.state, this.getCurrentUserLabs)}/>
            <Route path='/labs/:labId/edit' component={WaitForComponent(LabEdit, this.state, this.getCurrentUserLabs)}/>
            <Route path='/labs/:labId/delete' component={WaitForComponent(LabDelete, this.state, this.getCurrentUserLabs)}/>
            <Route path="/labs/:labId" component={WaitForComponent(LabProfile, this.state, this.getCurrentUserLabs)}/>
          </Switch>  

          <Switch>
            <Route path='/containers/:containerId/add/:itemType' component={WaitForComponent(ContainerAdd, this.state, this.getCurrentUserLabs)}/>
            <Route path="/containers/:containerId/edit" component={WaitForComponent(ContainerEdit, this.state, this.getCurrentUserLabs)}/>
            <Route path='/containers/:containerId/delete' component={WaitForComponent(ContainerDelete, this.state, this.getCurrentUserLabs)}/>
            <Route path="/containers/:containerId" component={WaitForComponent(ContainerProfile, this.state, this.getCurrentUserLabs)}/>
          </Switch>  

          <Switch>
            <Route path="/signup" exact render={(props) => (<Signup {...props} {...this.state}/>)}/>
            <Route path="/login" exact render={(props) => (<Login {...props} {...this.state} setCurrentUser={this.setCurrentUser}/>)}/>
            <Route path="/about" exact component={WaitForComponent(About, this.state)}/>
            <Route path="/" exact component={WaitForComponent(Landing, this.state)}/>
          </Switch>

        </main>
        <Footer />
      </div>
    );
  }
}

export default App;
