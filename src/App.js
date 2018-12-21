import React, { Suspense, lazy } from 'react';
import { withRouter, Route, Switch } from "react-router-dom";
import Crypto from 'crypto-js';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';
import Loading from './components/Loading/Loading';
import Auth from "./modules/Auth";
import Api from './modules/Api';
import appConfig from './configuration.js';
import Navigation from './components/Navigation/Navigation';
import Footer from './components/Footer/Footer';
import Login from './components/Login';
import Signup from './components/Signup';
import Profile from './components/Profile';

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
      physicals: [],
      lab: {},
      selectedRecordType: {},
      selectedRecord: {},
      params: []
    };
    this.loginCurrentUser = this.loginCurrentUser.bind(this);
    this.logoutCurrentUser = this.logoutCurrentUser.bind(this);
    this.getData = this.getData.bind(this);
    this.refresh = this.refresh.bind(this);
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

  async getData() {
    let result = {};
    // get labs
    let labsResponse = await Api.getAll('labs');
    result.labs = labsResponse.data; 
    // get physicals
    let physicalsResponse = await Api.getAll('physicals');
    result.physicals = physicalsResponse.data; 
    // get virtuals
    let virtualsResponse = await Api.getAll('virtuals');
    result.virtuals = virtualsResponse.data;  
    //console.log('App.getData.result', result);

    // detect if route is for a specific lab or container
    const params = String(this.props.location.pathname).split('/');
    result.params = params;

    //console.log('App.getData.params', params);
    const hasParams = params.length > 2;
    let type;
    switch (params[1]) {
      case 'labs':
        type = 'Lab';
        break;
      case 'containers':
        type = 'Container';
        break;
      case 'physicals':
        type = 'Physical';
        break;
      case 'virtuals':
        type = 'Virtual';
        break;  
      default: 
        type = null;     
    }
    result.selectedRecordType = type;

    let lab; //eslint-disable-line
    let selectedRecord; //eslint-disable-line
    let selectedRecordId = hasParams ? params[2] : null;
    switch (type) {
      case 'Lab':
        for(let i = 0; i < result.labs.length; i++){
          let record = result.labs[i];
          if (selectedRecordId && String(record._id) === String(selectedRecordId)) {
            let populateResponse = await Api.getOne('labs', record._id);
            let populatedLab = populateResponse.data;
            let allLabChildren = await getChildren(populatedLab);
            populatedLab.allChildren = allLabChildren;
            lab = populatedLab;
            selectedRecord = populatedLab;
          }
        }
        break;
      default:
        lab = null;
    }
    result.lab = lab;
    result.selectedRecord = selectedRecord;

    // currentUser

    let currentUser = {};
    let isLoggedIn = false;
    
    if (Auth.isUserAuthenticated()) {
      let response = await this.loginCurrentUser();
      currentUser = response.user;
      isLoggedIn = true;
      currentUser.gravatarUrl = `https://www.gravatar.com/avatar/${Crypto.MD5(currentUser.email).toString()}?s=100`;
      let labs = result.labs;
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
    }
    result.isLoggedIn = isLoggedIn;
    result.currentUser = currentUser;
    //console.log('App.getData.result', result);
    return result;
  }

  refresh() {
    this.getData()
    .then((res) => {
      //console.log('App.refresh.res', res);
      let newState = {
        lab: res.lab,
        labs: res.labs,
        physicals: res.physicals,
        virtuals: res.virtuals,
        params: res.params,
        selectedRecordType: res.selectedRecordType,
        selectedRecord: res.selectedRecord,
        isLoggedIn: res.isLoggedIn,
        currentUser: res.currentUser
      };
      console.log('App.refresh.state', newState);
      this.setState(newState);
    });
  }

  componentDidMount() {
    this.refresh();
  }

  componentDidUpdate() {
    const params = String(this.props.location.pathname).split('/');
    const hasParams = params.length > 2;
    const oldParams = this.state.params;
    const hasOldParams = oldParams.length > 2;
    const newParamsAdded = hasParams && oldParams.length === 2;
    const endpointsDontMatch = hasParams && hasOldParams && String(params[1]) !== String(oldParams[1]);
    const idsDontMatch = hasParams && hasOldParams && String(params[2]) !== String(oldParams[2]);
    const paramsHaveChanged = newParamsAdded || endpointsDontMatch || idsDontMatch;
    if (paramsHaveChanged) {
      console.log('parameters have changed... refreshing...');
      //console.log('App.componentDidUpdate.state', this.state);
      this.refresh();
    }  
  }

  render() {
    //console.log('App.state', this.state);
    return (
      <div className="App">
        <Navigation 
          {...this.state} 
          logoutCurrentUser={this.logoutCurrentUser} 
          getCurrentUserLabs={this.getCurrentUserLabs}
          refresh={this.refresh}
        />
        <main className="viewport-container">

          <Switch>
            <Route path="/labs/new" exact component={WaitForComponent(LabNew, this.state, this.getCurrentUserLabs)}/>
            <Route path='/labs/:labId/add/:itemType' component={WaitForComponent(LabAdd, this.state, this.getCurrentUserLabs)}/>
            <Route path='/labs/:labId/edit' component={WaitForComponent(LabEdit, this.state, this.getCurrentUserLabs)}/>
            <Route path='/labs/:labId/delete' component={WaitForComponent(LabDelete, this.state, this.getCurrentUserLabs)}/>
            {/* <Route path="/labs/:labId" render={(props) => (<Profile {...props} {...this.state}/>)} /> */}
            <Route path="/labs/:labId" component={WaitForComponent(LabProfile, this.state, this.refresh)}/>
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

export default withRouter(App);

let allChildren = {
  containers: [],
  physicals: []
};
async function getAllChildren (record) {
  //console.log('getAllChildren', record);
  if (record.children && record.children.containers && record.children.physicals) {
    for(let i = 0; i < record.children.containers.length; i++){
      let container = record.children.containers[i];
      allChildren.containers.push(container);
      await getAllChildren(container);
    }
    for(let i = 0; i < record.children.physicals.length; i++){
      let physical = record.children.physicals[i];
      allChildren.physicals.push(physical);
    }
  }
}

async function getChildren (record) {
  if (record) { 
    console.log('getChildren', record);
    let res = await getAllChildren(record);
    return allChildren;
  }  
}
