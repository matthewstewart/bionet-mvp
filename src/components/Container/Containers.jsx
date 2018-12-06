import React, { Component } from 'react';
import Auth from "../../modules/Auth";
import appConfig from '../../configuration.js';
import { Link } from 'react-router-dom';
import shortid from 'shortid';
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import 'react-bootstrap-typeahead/css/Typeahead-bs4.css';
import Grid from '../Grid/Grid';

class Containers extends Component {

  constructor(props) {
    super(props);
    this.state = {
      mode: 'List',
      containers: [],
      container: {},
      currentParent: {},
      newParent: {},
      newParentContainers: [],
      newParentPhysicals: [],
      newItemLocations: []
    };
    this.onMoveCancel = this.onMoveCancel.bind(this);
    this.updateContainer = this.updateContainer.bind(this);
    this.updateLocation = this.updateLocation.bind(this);
    this.onChangeMode = this.onChangeMode.bind(this);
    this.changeMode = this.changeMode.bind(this);
    this.handleNewParentChange = this.handleNewParentChange.bind(this);
    this.addLocation = this.addLocation.bind(this);
    this.removeLocation = this.removeLocation.bind(this);
  }

  async updateContainer(container) {
    try {  
      let request = new Request(`${appConfig.apiBaseUrl}/containers/${container._id}/edit`, {
        method: 'POST',
        body: JSON.stringify(container),
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
      console.log('Containers.updateContainer', error);
    }   
  }

  onMoveCancel() {
    this.changeMode("List");
  }

  updateLocation() {
    let container = this.state.container;
    container.parent = this.state.newParent._id;
    container.locations = this.state.newItemLocations;
    this.updateContainer(container)
    .then((res) => {
      this.props.refresh(this.props.currentUser);
    });
  }

  onChangeMode(e) {
    //console.log('onChangeMode started...');
    let containers = this.props.containers || [];
    let container = {};
    let currentParent = {};
    let mode = e.target.getAttribute('mode');
    //console.log('onChangeMode.e.attr.mode', mode);
    for(let i = 0; i < containers.length; i++){
      let thisContainer = containers[i];
      if (thisContainer._id === e.target.id){
        container = thisContainer;
        currentParent = thisContainer.parent;
      }
    }
    this.setState({ 
      containers,
      container,
      mode,
      currentParent
    });
  }

  changeMode(mode) {
    this.setState({mode});
  }

  handleNewParentChange(selectedArray) {
    let newParent = selectedArray[0] || {};
    let newParentIsLab = Object.keys(newParent).indexOf('parent') === -1;
    let labContainers = this.props.labContainers;
    let labPhysicals = this.props.labPhysicals;
    console.log('Containers.handleNewParentChange.labPhysicals', labPhysicals);
    let newParentContainers = [];
    let newParentPhysicals = [];
    for(let i = 0; i < labContainers.length; i++){
      let labContainer = labContainers[i];
      // console.log(`labContainer ${i + 1}`, labContainer);
      // console.log(`labContainer ${i + 1} parent`, labContainer.parent);
      if (newParentIsLab){
        if (labContainer.parent === null) {
          newParentContainers.push(labContainer);
        }
      } else {
        if (labContainer.parent !== null && labContainer.parent._id === newParent._id) {
          newParentContainers.push(labContainer);
        }
      }
    }
    for(let i = 0; i < labPhysicals.length; i++){
      let labPhysical = labPhysicals[i];
      console.log(`labPhysical ${i + 1}`, labPhysical);
      console.log(`labPhysical ${i + 1} parent`, labPhysical.parent);
      if (newParentIsLab){
        if (labPhysical.parent === null) {
          newParentPhysicals.push(labPhysical);
        }
      } else {
        if (labPhysical.parent !== null && labPhysical.parent._id === newParent._id) {
          newParentPhysicals.push(labPhysical);
        }
      }      
    }
    this.setState({
      newParent,
      newParentContainers,
      newParentPhysicals,
      mode: "Move Step 2"
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

  componentDidMount() {

  }  

  render() {
    const mode = this.state.mode;
    const containers = this.props.containers || [];
    //console.log('Containers.containers', containers);
    const labContainers = this.props.labContainers || [];
    //console.log('Containers.labContainers', labContainers);
    const container = this.state.container;
    const userIsMember = this.props.userIsMember;
    const newParentExists = Object.keys(this.state.newParent).length > 0;

    let title;
    let titleClasses = "mdi mdi-grid mr-2";
    switch(mode) {
      case 'List':
        title = `Containers (${containers.length})`;
        break;
      case 'Move Step 1':
        title = `Move ${container.name} Step 1/2 - Select Parent`;
        break; 
      case 'Move Step 2':
        title = `Move ${container.name} Step 2/2 - Select Location`;
        break;     
      default:
        title = `Containers (${containers.length})`;
    }

    let allParentOptions = [container.lab].concat(labContainers);
    let newParentOptions = [];
    if(Object.keys(container).length > 0 && containers.length > 0) {
      if (containers && containers.length > 0) {
        for (let i = 0; i < allParentOptions.length; i++){
          let option = allParentOptions[i];
          if (i === 0) { // first entry is lab
            if (this.state.currentParent !== null) {
              console.log(container);
              //newParentOptions.push(option);
            }
          }
          //console.log(option);
          if (option._id !== container._id) {
            newParentOptions.push(option);
          }
        }
      }
    }  

    const containersList = containers.map((thisContainer, index) => {
      return (
        <div key={shortid.generate()} className="d-block">
          <div className="container-fluid pl-0 pr-0">
            <div className="row no-gutters">
              <div className={userIsMember ? "col-7 col-md-8 col-lg-9" : "col-12"}>
                <Link to={`/containers/${thisContainer._id}`} className="list-group-item list-group-item-action bg-info text-light rounded-0">
                  <h5 className="mb-0">
                    <i className="mdi mdi-grid mr-2" />{thisContainer.name}
                  </h5>
                </Link>  
              </div> 
              {userIsMember ? (
                <div className="col-5 col-md-4 col-lg-3 text-center">
                  <button 
                    className="list-group-item list-group-item-action bg-primary text-light rounded-0"
                    onClick={this.onChangeMode}
                    id={thisContainer._id}
                    mode='Move Step 1'
                  >
                    <h5 
                      className="mb-0"
                      id={thisContainer._id}
                      mode='Move Step 1'
                    >
                      <i className="mdi mdi-arrow-up-down-bold-outline mr-2" />Move
                    </h5>
                  </button>
                </div> 
              ) : null }  
            </div>  
          </div>
        </div>    
      );
    });

    return (
      <div className="card rounded-0 mt-3 mb-3">
        <div className="card-header bg-dark text-light rounded-0">
          <h5 className="card-title mb-0 text-capitalize">
            <i className={titleClasses}/>{title}
          </h5>
        </div>

        {(mode === 'List') ? (
          <ul className="list-group list-group-flush d-block">
            {containersList}
          </ul>
        ) : null }  

        {(mode === 'Move Step 1') ? (
          <div className="card-body">
            <p className="card-text">
              What container would you like to move {container.name} to?
            </p>
            <form onSubmit={this.onFormSubmit}>
              <div className="form-group">
                <label htmlFor="newparent">New Location:</label>
                <Typeahead
                  labelKey="name"
                  name="newparent"
                  onChange={(selected) => {this.handleNewParentChange(selected)}}
                  onPaginate={(e) => console.log('Results paginated')}
                  options={newParentOptions}
                  paginate={true}
                  placeholder="Select New Location"
                  className="border-0"
                  maxResults={50}
                />
                <button 
                  className="btn btn-secondary rounded-0 mt-3"
                  onClick={this.onMoveCancel}
                >Cancel Move</button>
              </div>
            </form>  
          </div>
        ) : null }  

        {(mode === 'Move Step 2') ? (
          <div className="card-body">
            <p className="card-text">
              Where would you like to move {container.name} to within {this.state.newParent.name}?<br/>
              Click on an empty location within {this.state.newParent.name}.<br/>
              Click on your selected location to unselect.
            </p>
            <button 
              className="btn btn-secondary rounded-0 mt-3"
              onClick={this.onMoveCancel}
            >Cancel Move</button>
            {(this.state.newItemLocations.length > 0) ? (
              <>
                <p className="card-text">
                  Move {container.name} to {this.state.newParent.name} Column {this.state.newItemLocations[0][0]} Row {this.state.newItemLocations[0][1]} ?  
                </p>
                <div className="btn-group mb-3">
                  <button 
                    className="btn btn-success rounded-0"
                    onClick={this.updateLocation}
                  >Yes, Move {container.name}</button> 
                  <button 
                    className="btn btn-secondary rounded-0"
                    onClick={this.onMoveCancel}
                  >Cancel Move</button>
                </div>
              </> 
            ) : null }
            <Grid 
              demo={false}
              selectLocations={true}
              selectSingle={true}
              newItemLocations={this.state.newItemLocations}
              addLocation={this.addLocation}
              removeLocation={this.removeLocation}
              recordType="Container"
              record={newParentExists ? this.state.newParent : this.state.container}
              containers={newParentExists ? this.state.newParentContainers : this.state.containers}
              physicals={newParentExists ? this.state.newParentPhysicals : this.props.physicals}
            />
          </div>
        ) : null }  

      </div>
    );
  }
}

export default Containers;
