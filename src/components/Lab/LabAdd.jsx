import React from 'react';
// import { Link } from 'react-router-dom';
// import shortid from 'shortid';
import Auth from "../../modules/Auth";
import appConfig from '../../configuration.js';
import Grid from '../Grid/Grid';
import ContainerNewForm from '../Container/ContainerNewForm';
import PhysicalNewForm from '../Physical/PhysicalNewForm';
import './LabProfile.css';

class LabAdd extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      lab: {},
      containers: [],
      physicals: [],
      newItemLocations: []
    };
    this.getLab = this.getLab.bind(this);
    this.updateLab = this.updateLab.bind(this);
    this.addLocation = this.addLocation.bind(this);
    this.removeLocation = this.removeLocation.bind(this);
  }

  async getLab(labId) {
    try {  
      let labRequest = new Request(`${appConfig.apiBaseUrl}/labs/${labId}`, {
        method: 'GET',
        headers: new Headers({
          'Authorization': `Bearer ${Auth.getToken()}`
        })
      });
      let labRes = await fetch(labRequest);
      let labResponse = labRes.json();
      return labResponse;
    } catch (error) {
      console.log('LabProfile.getLab', error);
    }  
  }

  async postLab(lab) {
    try {  
      let labRequest = new Request(`${appConfig.apiBaseUrl}/labs/${lab._id}/membership`, {
        method: 'POST',
        //mode: "cors",
        body: JSON.stringify(lab),
        headers: new Headers({
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Auth.getToken()}`
        })
      });
      let labRes = await fetch(labRequest);
      let labResponse = labRes.json();
      return labResponse;
    } catch (error) {
      console.log('LabProfile.postLab', error);
    }   
  }

  getData() {
    let labId = this.props.match.params.labId;
    this.getLab(labId)
    .then((res) => {
      console.log('LabAdd.getData.res', res);
      this.setState({
        lab: res.data,
        containers: res.children,
        physicals: res.physicals
      });
    });
  }

  updateLab(lab) {
    this.postLab(lab)
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
      <div className="LabProfile container-fluid">
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
                          Select one or more cells for the Container to occupy within {this.state.lab.name}.
                        </p>
                      ) : (
                        <p className="card-text">
                          Select which cell the Physical Sample will occupy within {this.state.lab.name}.
                        </p>
                      )}    
                    </div>
                  ) : (
                    <div className="card-body">
                      {(itemType === 'container') ? (
                        <ContainerNewForm 
                          {...this.props} 
                          {...this.state}
                        />
                      ) : null } 
                      {(itemType === 'physical') ? (
                        <PhysicalNewForm 
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
                  demo={false}
                  selectLocations={true}
                  selectSingle={itemType === 'physical'}
                  newItemLocations={this.state.newItemLocations}
                  addLocation={this.addLocation}
                  removeLocation={this.removeLocation}
                  recordType="Lab"
                  record={this.state.lab}
                  containers={this.state.containers}
                  physicals={this.state.physicals}
                />
              </div>
            </>
          ) : null }  
        </div>
      </div>
    );
  }
}

export default LabAdd;
