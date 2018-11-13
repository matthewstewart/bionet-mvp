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
      newItemLocations: []
    };
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
    let containers = this.props.containers || [];
    let container = {};
    let currentParent = {};
    let mode = e.target.getAttribute('mode');
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
    this.setState({
      newParent,
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
    const container = this.state.container;
    // const currentParent = this.state.currentParent;
    // const newParent = this.state.newParent;

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

    let allParentOptions = [container.lab].concat(containers);
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
        <div 
          key={shortid.generate()}
          className="list-group-item list-group-item-action rounded-0"
        >
          <h4 className="mb-0">
            <i className="mdi mdi-grid mr-2" />{thisContainer.name}
            <div className="btn-group float-right">
              <Link 
                to={`/containers/${thisContainer._id}`}
                mode='View'
                className="btn btn-sm btn-info rounded-0"
                onClick={this.onChangeMode}
              >View Details
              </Link>
              <div 
                id={thisContainer._id}
                mode='Move Step 1'
                className="btn btn-sm btn-primary rounded-0"
                onClick={this.onChangeMode}
              >Move
              </div>
            </div>  
          </h4>
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
          <ul className="list-group list-group-flush">
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
                  >Cancel</button>
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
              record={Object.keys(this.state.newParent).length > 0 ? this.state.newParent : this.state.container}
              containers={this.state.containers}
              physicals={this.props.physicals}
            />
          </div>
        ) : null }  

      </div>
    );
  }
}

export default Containers;
