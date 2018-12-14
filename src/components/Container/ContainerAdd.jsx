import React from 'react';
// import { Link } from 'react-router-dom';
// import shortid from 'shortid';
import Auth from "../../modules/Auth";
import appConfig from '../../configuration.js';
import Grid from '../Grid/Grid';
import ContainerNewForm from '../Container/ContainerNewForm';
import PhysicalNewForm from '../Physical/PhysicalNewForm';

class ContainerAdd extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      lab: {},
      container: {},
      containers: [],
      physicals: [],
      newItemLocations: []
    };
    this.getContainer = this.getContainer.bind(this);
    this.postContainer = this.postContainer.bind(this);
    this.updateContainer = this.updateContainer.bind(this);
    this.addLocation = this.addLocation.bind(this);
    this.removeLocation = this.removeLocation.bind(this);
  }

  async getContainer(containerId) {
    try {  
      let request = new Request(`${appConfig.apiBaseUrl}/containers/${containerId}`, {
        method: 'GET',
        headers: new Headers({
          'Authorization': `Bearer ${Auth.getToken()}`
        })
      });
      let res = await fetch(request);
      let response = res.json();
      return response;
    } catch (error) {
      console.log('ContainerProfile.getContainer', error);
    }  
  }

  async postContainer(formData) {
    try {  
      let request = new Request(`${appConfig.apiBaseUrl}/containers/new`, {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: new Headers({
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Auth.getToken()}`
        })
      });
      let res = await fetch(request);
      let response = res.json();
      return response;
    } catch (error) {
      console.log('ContainerEdit.postContainer', error);
    }   
  }

  getData() {
    let containerId = this.props.match.params.containerId;
    this.getContainer(containerId)
    .then((res) => {
      this.setState({
        lab: res.data.lab,
        container: res.data,
        containers: res.containers,
        physicals: res.physicals
      });
    });
  }

  updateContainer(container) {
    let containerRecord = container;
    containerRecord['parent'] = container._id;
    this.postContainer(containerRecord)
    .then((res) => {
      console.log(res);
      this.getData();
      this.props.refresh(this.props.currentUser);
    });
  }

  addLocation(newLocationArray) {
    //console.log('add location called');
    let locations = this.state.newItemLocations;
    let locationExists = false;
    for(let i = 0; i < locations.length; i++){
      let locationArray = locations[i];
      if (locationArray[0] === newLocationArray[0] && locationArray[1] === newLocationArray[1]) {
        locationExists = true;
      }
    }
    if (!locationExists) {
      locations.push(newLocationArray);
    }
    this.setState({
      newItemLocations: locations
    });
  }

  removeLocation(locationArrayToRemove) {
    //console.log('remove location called', locationArrayToRemove);
    let locations = this.state.newItemLocations;
    //console.log('Locations', locations);
    let updatedLocations = [];
    for(let i = 0; i < locations.length; i++){
      let locationArray = locations[i];
      let firstIndexMatches = locationArray[0] === locationArrayToRemove[0];
      let secondIndexMatches = locationArray[1] === locationArrayToRemove[1];
      let isMatch = firstIndexMatches && secondIndexMatches;
      if (!isMatch) {
        updatedLocations.push(locationArray);
      }
    }
    //console.log('Update Locations', updatedLocations);
    this.setState({
      newItemLocations: updatedLocations
    });
  }

  // onRequestLabMembership(e) {
  //   let lab = this.state.lab;
  //   let users = [];
  //   let joinRequests = [];
  //   for(let i = 0; i < lab.users.length; i++){
  //     let user = lab.users[i];
  //     users.push(user._id);
  //   };
  //   for(let i = 0; i < lab.joinRequests.length; i++){
  //     let request = lab.joinRequests[i];
  //     joinRequests.push(request._id);
  //   };
  //   joinRequests.push(this.props.currentUser._id);
  //   lab.users = users;
  //   lab.joinRequests = joinRequests;
  //   //console.log(lab);
  //   this.updateLab(lab);
  // }

  componentDidMount() {
    this.getData();
  }

  render() {
    const isLoggedIn = this.props.isLoggedIn;
    const currentUser = this.props.currentUser;
    const lab = this.state.lab;
    const itemType = this.props.match.params.itemType || "container";
    const itemIconClasses = itemType === "container" ? "mdi mdi-grid mr-2" : "mdi mdi-flask mr-2";

    let userIsMember = false;
    if (isLoggedIn) {
      for (let i = 0; i < currentUser.labs.length; i++) {
        let userLab = currentUser.labs[i];
        if (userLab._id === lab._id) { userIsMember = true; }
      }
    }


    return (
      <div className="ContainerAdd container-fluid">
        <div className="row">
          {(isLoggedIn && userIsMember) ? (
            <>
              <div className="col-12 col-lg-7">
                <div className="card rounded-0 mt-3">
                  <div className="card-header rounded-0 bg-dark text-light">
                    <h4 className="card-title mb-0 text-capitalize">
                      <i className={itemIconClasses}/>Add {itemType}
                    </h4>
                  </div>
                  {(this.state.newItemLocations.length === 0) ? (
                    <div className="card-body">
                      {(itemType === 'container') ? (
                        <p className="card-text">
                          Select one or more cells for the Container to occupy within {this.state.container.name}.
                        </p>
                      ) : (
                        <p className="card-text">
                          Select which cell the Physical Sample will occupy within {this.state.container.name}.
                        </p>
                      )}    
                    </div>
                  ) : (
                    <div className="card-body">
                      {(itemType === 'container') ? (
                        <ContainerNewForm 
                          parentType="Container"
                          lab={this.state.lab}
                          container={this.state.container}
                          newItemLocations={this.state.newItemLocations}
                          {...this.props}
                        />
                      ) : null } 
                      {(itemType === 'physical') ? (
                        <PhysicalNewForm 
                          parentType="Container"
                          {...this.props} 
                          {...this.state}
                        />
                      ) : null }     
                    </div>
                  )} 
                </div>
              </div>
              <div className="col-12 col-lg-5">
                <Grid 
                  {...this.props}
                  demo={false}
                  selectLocations={true}
                  selectSingle={itemType === 'physical'}
                  newItemLocations={this.state.newItemLocations}
                  addLocation={this.addLocation}
                  removeLocation={this.removeLocation}
                  type="Container"
                  record={this.state.container}
                  containers={this.state.containers}
                  physicals={this.state.physicals}
                  lab={this.state.lab}
                />
              </div>
            </>
          ) : null }  
        </div>
      </div>
    );
  }
}

export default ContainerAdd;
