import React from 'react';
import { Link } from 'react-router-dom';
import shortid from 'shortid';
import Auth from "../../modules/Auth";
import appConfig from '../../configuration.js';
import Grid from '../Grid/Grid';
import Containers from '../Container/Containers';
import Physicals from '../Physical/Physicals';
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';

class ContainerProfile extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      error: "",
      path: [],
      lab: {},
      container: {},
      containers: [],
      physicalsMode: "List",
      physicals: [],
      physical: {}
    };
    this.getPath = this.getPath.bind(this);
    this.getContainer = this.getContainer.bind(this);
    this.postLab = this.postLab.bind(this);
    this.getData = this.getData.bind(this);
    this.onRequestLabMembership = this.onRequestLabMembership.bind(this);
    this.onCancelRequestLabMembership = this.onCancelRequestLabMembership.bind(this);
    this.onAcceptRequestLabMembership = this.onAcceptRequestLabMembership.bind(this);
    this.onDenyRequestLabMembership = this.onDenyRequestLabMembership.bind(this);
    this.onRevokeLabMembership = this.onRevokeLabMembership.bind(this);
    this.updateLab = this.updateLab.bind(this);
    this.onCellDragStart = this.onCellDragStart.bind(this);
    this.onCellDragOver = this.onCellDragOver.bind(this);
    this.onCellDragEnd = this.onCellDragEnd.bind(this);
    this.onCellDrop = this.onCellDrop.bind(this);
    this.moveItem = this.moveItem.bind(this);
    this.changePhysicalsMode = this.changePhysicalsMode.bind(this);
  }

  changePhysicalsMode(mode, physical) {
    switch(mode) {
      case 'List':
        this.setState({
          physicalsMode: "List",
          physical: {}
        });
        break;
      case 'View': 
        this.setState({
          physicalsMode: "View",
          physical
        });
        break;
      case 'Edit':
        this.setState({
          physicalsMode: "Edit",
          physical
        });
        break;      
      case 'Delete':
        this.setState({
          physicalsMode: "Delete",
          physical
        });
        break;       
      default:
        this.setState({
          physicalsMode: "List",
          physical: {}
        });
    }
  }

  onPhysicalModeChangeClick(e) {
    let physicalId = e.target.getAttribute('id');
    console.log(physicalId);
  }

  async getPath(labId, containerId) {
    try {  
      let request = new Request(`${appConfig.apiBaseUrl}/labs/${labId}/container/${containerId}`, {
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

  async postContainer(container) {
    try {  
      let request = new Request(`${appConfig.apiBaseUrl}/containers/${container._id}/edit`, {
        method: 'POST',
        //mode: "cors",
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
      console.log('LabProfile.postContainer', error);
    }   
  }

  async postPhysical(physical) {
    try {  
      let request = new Request(`${appConfig.apiBaseUrl}/physicals/${physical._id}/edit`, {
        method: 'POST',
        //mode: "cors",
        body: JSON.stringify(physical),
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
      console.log('LabProfile.postPhysical', error);
    }   
  } 

  moveItem(item) {
    let itemType = Object.keys(item).indexOf('virtual') > -1 ? "Physical" : "Container";
    if (itemType === "Physical") {
      this.postPhysical(item)
      .then((res) => {
        this.props.refresh(this.props.currentUser);
      });
    } else {
      this.postContainer(item)
      .then((res) => {
        this.props.refresh(this.props.currentUser);
      });
    }
  }

  onCellDragStart(e) {
    console.log('onCellDragStart');
    // let selectedRecord = this.props.selectedRecord;
    // let children = selectedRecord.children || [];
    let children = this.state.containers.concat(this.props.physicals);
    //console.log(children);
    let originRow = Number(e.target.getAttribute('row'));
    let originColumn = Number(e.target.getAttribute('col'));
    //console.log('origin', originColumn, originRow);
    let draggedCell;
    for(let i = 0; i < children.length; i++){
      let child = children[i];
      if(String(child._id) === String(e.target.id)){
        draggedCell = child;
        for(let j = 0; j < draggedCell.locations.length; j++){
          let column = draggedCell.locations[j][0];
          let row = draggedCell.locations[j][1];
          if (column === originColumn && row === originRow){
            draggedCell['moveLocationIndex'] = j;
          }
        }
      }
    }
    //console.log('draggedCell: ', draggedCell);
    e.dataTransfer.setData("draggedCell", JSON.stringify(draggedCell));
  }

  onCellDragOver(e) {
    e.preventDefault();
  }

  onCellDragEnd(e) {
    //console.log('onCellDragEnd'); 
    this.setState({
      dragging: false
    }); 
  }

  onCellDrop(e) {
    console.log('onCellDrop');
    const draggedCell = JSON.parse(e.dataTransfer.getData("draggedCell"));
    //console.log('draggedCell+data', draggedCell);
    const targetCellRow = Number(e.target.getAttribute('row'));
    const targetCellColumn = Number(e.target.getAttribute('col'));
    draggedCell.locations[draggedCell.moveLocationIndex] = [targetCellColumn, targetCellRow];
    //const targetCellPosition = Number(e.target.getAttribute('pos'));
    //console.log(`Cell ${draggedCell.name} dragged and dropped to ${targetCellColumn}, ${targetCellRow}`);
    //console.log('updatedDraggedCell', draggedCell);
    this.moveItem(draggedCell);
    // this.setState({
    //   dragging: false
    // }); 
  }

  getData() {
    let containerId = this.props.match.params.containerId;
    this.getContainer(containerId)
    .then((res) => {
      //console.log('getData.res', res);
      let lab = res.data.lab;
      let container = res.data;
      let containers = res.containers;
      let physicals = res.physicals;
      this.getPath(lab._id, container._id)
      .then((res) => {
        this.setState({
          path: res.data,
          lab,
          container,
          containers,
          physicals
        });
      });  
    });
  }

  onRequestLabMembership(e) {
    let lab = this.state.lab;
    let users = [];
    let joinRequests = [];
    for(let i = 0; i < lab.users.length; i++){
      let user = lab.users[i];
      users.push(user._id);
    };
    for(let i = 0; i < lab.joinRequests.length; i++){
      let request = lab.joinRequests[i];
      joinRequests.push(request._id);
    };
    joinRequests.push(this.props.currentUser._id);
    lab.users = users;
    lab.joinRequests = joinRequests;
    //console.log(lab);
    this.updateLab(lab);
  }

  onCancelRequestLabMembership(e) {
    let lab = this.state.lab;
    let users = [];
    let joinRequests = [];
    for(let i = 0; i < lab.users.length; i++){
      let user = lab.users[i];
      users.push(user._id);
    };
    for(let i = 0; i < lab.joinRequests.length; i++){
      let request = lab.joinRequests[i];
      if (this.props.currentUser._id !== request._id){
        joinRequests.push(request._id);
      }
    };
    lab.users = users;
    lab.joinRequests = joinRequests;
    console.log('LabProfile.onCancelRequestLabMembership.lab', lab);
    this.updateLab(lab);
  }

  onAcceptRequestLabMembership(e) {
    let acceptedRequestId = e.target.getAttribute('userid');
    let lab = this.state.lab;
    let users = [];
    let joinRequests = [];
    for(let i = 0; i < lab.users.length; i++){
      let user = lab.users[i];
      users.push(user._id);
    };
    users.push(acceptedRequestId);
    for(let i = 0; i < lab.joinRequests.length; i++){
      let request = lab.joinRequests[i];
      if (acceptedRequestId !== request._id){
        joinRequests.push(request._id);
      }
    };
    lab.users = users;
    lab.joinRequests = joinRequests;
    this.updateLab(lab);
  }

  onDenyRequestLabMembership(e) {
    let deniedRequestId = e.target.getAttribute('userid');
    let lab = this.state.lab;
    let users = [];
    let joinRequests = [];
    for(let i = 0; i < lab.users.length; i++){
      let user = lab.users[i];
      users.push(user._id);
    };
    for(let i = 0; i < lab.joinRequests.length; i++){
      let request = lab.joinRequests[i];
      if (deniedRequestId !== request._id){
        joinRequests.push(request._id);
      }
    };
    lab.users = users;
    lab.joinRequests = joinRequests;
    this.updateLab(lab);
  }

  onRevokeLabMembership(e) {
    let lab = this.state.lab;
    let users = [];
    let joinRequests = [];
    if (lab.users.length === 1){
      this.setState({ 
        error: "You are the last member of this Lab. You must Delete the Lab to leave it."
      });
    } else {
      for(let i = 0; i < lab.users.length; i++){
        let user = lab.users[i];
        if (user._id !== this.props.currentUser._id){
          users.push(user._id);
        }  
      };
      for(let i = 0; i < lab.joinRequests.length; i++){
        let request = lab.joinRequests[i];
        joinRequests.push(request._id);
      };
      lab.users = users;
      lab.joinRequests = joinRequests;
      this.updateLab(lab);
    }      
  }
  
  updateLab(lab) {
    this.postLab(lab)
    .then((res) => {
      console.log(res);
      this.getData();
      this.props.refresh(this.props.currentUser);
    });
  }

  componentDidMount() {
    this.getData();
  }

  render() {
    const isLoggedIn = this.props.isLoggedIn;
    const currentUser = this.props.currentUser;
    const lab = this.state.lab;
    let userIsMember = false;
    let userIsRequestingMembership = false;
    if (isLoggedIn) {
      for (let i = 0; i < currentUser.labs.length; i++) {
        let userLab = currentUser.labs[i];
        if (userLab._id === lab._id) { userIsMember = true; }
      }
      for (let i = 0; i < currentUser.labsRequested.length; i++) {
        let userLab = currentUser.labsRequested[i];
        if (userLab._id === lab._id) { userIsRequestingMembership = true; }
      }
    }
    let labPhysicals = [];
    if (this.state.physicals && this.state.physicals.length){
      for(let i = 0; i < this.state.physicals.length; i++){
        let physical = this.state.physicals[i];
        if (physical.lab){
          //console.log(physical.lab._id, lab._id);
          if (physical.lab._id === lab._id){
            //console.log('match',physical.lab._id, lab._id);
            labPhysicals.push(physical);
          }
        }  
      }
    }


    const membershipRequests = isLoggedIn && lab.joinRequests ? lab.joinRequests.map((user, index) => {
      return (
        <div 
          key={shortid.generate()}
          className="join-request d-block"
        >
          <span className="float-left"><i className="mdi mdi-account mr-2"/>{user.username}</span>
          <div className="btn-group float-right ml-2">
            <button 
              className="btn btn-sm btn-success"
              userid={user._id}
              onClick={this.onAcceptRequestLabMembership}
            >
              <i className="mdi mdi-account-check mr-2" />Approve
            </button>
            <button 
              className="btn btn-sm btn-danger"
              userid={user._id}
              onClick={this.onDenyRequestLabMembership}
            >
              <i className="mdi mdi-account-minus mr-2" />Deny
            </button>
          </div>
        </div>
      )
    }) : [];
    return (
      <div className="ContainerProfile container-fluid">
        
        <div className="row">
          <div className="col-12 col-lg-7">

            <div className="card rounded-0 mt-3">
              <div className="card-header rounded-0 bg-dark text-light">
                <div className="card-title mb-0 text-capitalize">
                  <span><i className="mdi mdi-xl mdi-grid" />{this.state.container.name}</span>
                  <div id="heading-toolbar" className="btn-group float-right" role="group">
                    {(userIsMember) ? (
                      <>
                        <div className="btn-group" role="group">                           
                          <button 
                            id="add-button" 
                            type="button" 
                            className="btn btn-success dropdown-toggle rounded-0"
                            data-toggle="dropdown"
                            aria-haspopup="true"
                            aria-expanded="false"
                          >
                            <i className="mdi mdi-lg mdi-plus-box mr-1" />
                            Add&nbsp;
                          </button>
                          <div
                            className="dropdown-menu"
                            aria-labelledby="add-button"
                          >
                            <Link 
                              to={`/containers/${this.props.match.params.containerId}/add/container`}
                              className="dropdown-item"
                            >
                              <i className="mdi mdi-grid mr-2"/>
                              Container
                            </Link>
                            <Link 
                              to={`/containers/${this.props.match.params.containerId}/add/physical`}
                              className="dropdown-item"
                            >
                              <i className="mdi mdi-flask mr-2"/>
                              Physical
                            </Link>
                          </div>
                        </div>
                        <div className="btn-group" role="group">  
                          <button 
                            id="settings-button" 
                            type="button" 
                            className="btn btn-primary dropdown-toggle rounded-0"
                            data-toggle="dropdown"
                            aria-haspopup="true"
                            aria-expanded="false"
                          >
                            <i className="mdi mdi-lg mdi-settings-box mr-1" />
                            Settings&nbsp;
                          </button>
                          <div
                            className="dropdown-menu"
                            aria-labelledby="settings-button"
                          >
                            <Link 
                              to={`/containers/${this.props.match.params.containerId}/edit`}
                              className="dropdown-item"
                            >
                              <i className="mdi mdi-pencil mr-2"/>
                              Edit
                            </Link>
                            <Link 
                              to={`/containers/${this.props.match.params.containerId}/delete`}
                              className="dropdown-item"
                            >
                              <i className="mdi mdi-delete mr-2"/>
                              Delete
                            </Link>
                            <button 
                              className="dropdown-item bg-danger text-light"
                              onClick={this.onRevokeLabMembership}
                            >
                              <i className="mdi mdi-account-minus mr-2"/>
                              Leave Lab                              
                            </button>
                          </div>

                        </div>                       
                      </>
                    ) : null }
                    {(!userIsMember && !userIsRequestingMembership) ? (
                      <div className="btn-group" role="group">
                        <button  
                          className="btn btn-success rounded-0"
                          onClick={this.onRequestLabMembership}
                        >
                          <i className="mdi mdi-account-plus mr-1" />
                          Request Membership
                        </button>

                      </div> 
                    ) : null }
                    {(userIsRequestingMembership) ? (
                      <div className="btn-group" role="group">
                        <button 
                          className="btn btn-warning rounded-0 disabled"
                        >
                          <i className="mdi mdi-account-plus mr-1" />
                          Membership Pending Approval
                        </button>                             
                        <button 
                          className="btn btn-sm btn-secondary rounded-0"
                          onClick={this.onCancelRequestLabMembership}
                        >
                          <i className="mdi mdi-account-plus mr-1" />
                          Cancel Request
                        </button>
                      </div> 
                    ) : null }               
                  </div>
                </div>
              </div>
              {(isLoggedIn) ? (
                <>
                  <Breadcrumbs 
                    path={this.state.path}
                    lab={this.state.lab}
                    item={this.state.container}
                  />
                  <div className="card-body">
                    {(this.state.error.length > 0) ? (
                      <p className="card-text text-danger">
                        {this.state.error}
                      </p>
                    ) : null}
                    
                      {this.state.container.description && this.state.container.description.length > 0 ? (
                        <p className="card-text">{this.state.container.description}</p>
                      ) : (
                        <p className="card-text">No description provided.</p>
                      )}
                    {(userIsMember && lab && lab.joinRequests && lab.joinRequests.length > 0) ? (
                      <>
                      <h5>Membership Requests</h5> 
                      {membershipRequests}
                      </>
                    ) : null }
                  </div>
                </>
              ) : null}   
            </div>

              <Containers 
                containers={this.state.containers} 
                currentUser={this.props.currentUser}
                refresh={this.props.refresh}
                physicals={labPhysicals}                
              /> 
              
              <Physicals 
                physicals={this.state.physicals} 
                currentUser={this.props.currentUser}
                refresh={this.props.refresh}
              />   

          </div>

          {(isLoggedIn) ? (
            <div className="col-12 col-lg-5">
              <Grid 
                demo={false}
                selectLocations={false}
                recordType="Lab"
                record={this.state.container}
                containers={this.state.containers}
                physicals={this.state.physicals}
                dragging={this.state.dragging}
                onCellDragStart={this.onCellDragStart}
                onCellDragOver={this.onCellDragOver}
                onCellDrop={this.onCellDrop}
                onCellDragEnd={this.onCellDragEnd}
                {...this.state}
              />
            </div>
          ) : null }
        </div>
      </div>
    );
  }
}

export default ContainerProfile;
