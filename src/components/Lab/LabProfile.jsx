import React from 'react';
import { Link } from 'react-router-dom';
import shortid from 'shortid';
import Auth from "../../modules/Auth";
import appConfig from '../../configuration.js';
import Grid from '../Grid/Grid';
import './LabProfile.css';

class LabProfile extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      lab: {},
      containers: []
    };
    this.getLab = this.getLab.bind(this);
    this.postLab = this.postLab.bind(this);
    this.getData = this.getData.bind(this);
    this.onRequestLabMembership = this.onRequestLabMembership.bind(this);
    this.onCancelRequestLabMembership = this.onCancelRequestLabMembership.bind(this);
    this.onAcceptRequestLabMembership = this.onAcceptRequestLabMembership.bind(this);
    this.onDenyRequestLabMembership = this.onDenyRequestLabMembership.bind(this);
    this.onRevokeLabMembership = this.onRevokeLabMembership.bind(this);
    this.updateLab = this.updateLab.bind(this);
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
      console.log('getData.res', res);
      this.setState({
        lab: res.data,
        containers: res.children
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
      <div className="LabProfile container-fluid">
        
        <div className="row">
          <div className="col-12 col-lg-7">
            <div className="card rounded-0 mt-3">
              <div className="card-header rounded-0 bg-dark text-light">
                <div className="card-title mb-0 text-capitalize">
                  <span><i className="mdi mdi-xl mdi-teach" /> {lab.name}</span>
                  <div id="heading-toolbar" className="btn-group" role="group">
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
                              to={`/labs/${this.props.match.params.labId}/add/container`}
                              className="dropdown-item"
                            >
                              <i className="mdi mdi-grid mr-2"/>
                              Container
                            </Link>
                            <Link 
                              to={`/labs/${this.props.match.params.labId}/add/physical`}
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
                              to={`/labs/${this.props.match.params.labId}/edit`}
                              className="dropdown-item"
                            >
                              <i className="mdi mdi-pencil mr-2"/>
                              Edit
                            </Link>
                            <Link 
                              to={`/labs/${this.props.match.params.labId}/remove`}
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
                  <div className="card-body">
                    <p className="card-text">
                      {lab.description}
                    </p>
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
          </div>
          {(isLoggedIn) ? (
            <div className="col-12 col-lg-5">
              <Grid 
                demo={false}
                selectLocations={false}
                recordType="Lab"
                record={this.state.lab}
                containers={this.state.containers}
                {...this.props}
                {...this.state}
              />
            </div>
          ) : null }
        </div>
      </div>
    );
  }
}

export default LabProfile;
