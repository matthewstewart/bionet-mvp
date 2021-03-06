import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Auth from "../../modules/Auth";
import appConfig from '../../configuration.js';
//import Api from '../../modules/Api';
import { Navbar, NavbarBrand, NavbarNav, NavbarLink, NavbarDropdown, NavbarDropdownLink } from '../Bootstrap/components';
import shortid from 'shortid';
import logo from './images/bionet-logo.png';

class Navigation extends Component {

  constructor(props) {
    super(props);
    this.state = {  
      labs: [],
      lab: {},
      selectedRecordType: {},
      selectedRecord: {},
      params: []
    };
    this.postLab = this.postLab.bind(this);
    this.onAcceptRequestLabMembership = this.onAcceptRequestLabMembership.bind(this);
    this.onDenyRequestLabMembership = this.onDenyRequestLabMembership.bind(this);
    this.onCancelRequestLabMembership = this.onCancelRequestLabMembership.bind(this);
    this.updateLab = this.updateLab.bind(this);
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
      console.log('Navigation.postLab', error);
    }   
  }

  onAcceptRequestLabMembership(e) {
    let acceptedRequestId = e.target.getAttribute('userid');
    let labId = e.target.getAttribute('labid');
    let labs = this.props.labs;
    let lab;
    for(let i = 0; i < labs.length; i++){
      if (labId === labs[i]._id) {
        lab = labs[i];
      }
    }
    let users = [];
    let joinRequests = [];
    if (lab && lab.users && lab.joinRequests) {
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
    }  
    lab.users = users;
    lab.joinRequests = joinRequests;
    this.updateLab(lab);
  }

  onDenyRequestLabMembership(e) {
    let deniedRequestId = e.target.getAttribute('userid');
    let labId = e.target.getAttribute('labid');
    let labs = this.props.labs;
    let lab;
    for(let i = 0; i < labs.length; i++){
      if (labId === labs[i]._id) {
        lab = labs[i];
      }
    }
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

  onCancelRequestLabMembership(e) {
    let labId = e.target.getAttribute('labid');
    let labs = this.props.labs;
    let lab;
    let users = []; 
    let joinRequests = [];
    for(let i = 0; i < labs.length; i++){
      if (labId === labs[i]._id) {
        lab = labs[i];
      }
    }
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
    this.updateLab(lab);
  }

  updateLab(lab) {
    this.postLab(lab)
    .then((res) => {
      this.props.refresh();
    });
  }

  render() {
    const isLoggedIn = this.props.isLoggedIn;
    const currentUser = this.props.currentUser;
    const labs = this.props.labs || [];
    const labsJoined = isLoggedIn ? currentUser.labs.map((lab, index) => {
      const joinRequests = lab.joinRequests.map((user, userIndex) => {
        return (
          <div className="dropdown-header text-light d-block clearfix" key={shortid.generate()}>
            <span>{user.username}</span>
            <div className="btn-group float-right">
              <button 
                className="btn btn-xs btn-success"
                labid={lab._id}
                userid={user._id}
                onClick={this.onAcceptRequestLabMembership}
              >Accept</button>
              <button 
                className="btn btn-xs btn-danger"
                labid={lab._id}
                userid={user._id}
                onClick={this.onDenyRequestLabMembership}
              >Deny</button>
            </div> 
          </div>       
        );
      });
      return (
        <div key={shortid.generate()}>
          <NavbarDropdownLink 
            to={`/labs/${lab._id}`}
            className="bg-info text-light"
          >
            <i className="mdi mdi-teach mr-2"/>{lab.name}
          </NavbarDropdownLink>
          {(lab.joinRequests.length > 0) ? (
            <>
              <div className="dropdown-divider mt-0"></div>
              <h6 className="dropdown-header text-light">{lab.name} Join Requests - <i className="mdi mdi-account-plus mr-1"/>({lab.joinRequests.length })</h6>
              <div className="dropdown-divider mb-0"></div>
              {joinRequests}
            </>
          ) : null }
        </div>
      )
    }) : [];
    
    const hasLabsJoined = isLoggedIn && currentUser && currentUser.labs && currentUser.labs.length > 0;
    //console.log('nav.currentUser', currentUser);
    const labsNotJoined = isLoggedIn ? labs.map((lab, index) => {
      let labIsJoined = false;
      for(let i = 0; i < currentUser.labs.length; i++){
        let userLab = currentUser.labs[i];
        if (userLab._id === lab._id) {
          labIsJoined = true;
        }
      }
      if (!labIsJoined) {
        return (
          <NavbarDropdownLink 
            key={shortid.generate()}
            to={`/labs/${lab._id}`}
            className="bg-dark text-light"
          >
            <i className="mdi mdi-teach mr-2"/>{lab.name}
          </NavbarDropdownLink>
        );
      } else { return null }
    }) : [];
    const hasLabsNotJoined = labs && labsNotJoined.length > 0;
    const allLabs = labs.map((lab, index) => {
      return (
        <NavbarDropdownLink 
          key={shortid.generate()}
          to={`/labs/${lab._id}`}
          className="bg-dark text-light"
        >
          <i className="mdi mdi-teach mr-2"/>{lab.name}
        </NavbarDropdownLink>
      )
    });
    const hasLabsPendingApproval = isLoggedIn && currentUser && currentUser.labsRequested && currentUser.labsRequested.length > 0;
    const labsPendingApproval = hasLabsPendingApproval && currentUser.labsRequested.map((labRequest, index) => {
      return (
        <div className="dropdown-header text-light d-block clearfix" key={shortid.generate()}>
        <span>{labRequest.name}</span>
        <div className="btn-group float-right">
          <button 
            labid={labRequest._id}
            className="btn btn-xs btn-warning"
            onClick={this.onCancelRequestLabMembership}
          >Cancel</button>
        </div> 
      </div>        
      );
    }); 
    return (
      <Navbar dark type="dark" className="bg-dark-green">
        <NavbarBrand imgSrc={logo} imgAlt="BioNet Logo" width="40">
        </NavbarBrand>
        <NavbarNav>

          <NavbarDropdown id="user-dropdown" label={isLoggedIn ? currentUser.username : "Labs"} className="text-light">
            
            {(isLoggedIn) ? (
              <>
                {(hasLabsJoined) ? (
                  <>
                    <div className="dropdown-divider mt-0"></div>
                    <h6 className="dropdown-header text-light">Labs Joined - <i className="mdi mdi-teach mr-1"/>({labsJoined.length})</h6>
                    <div className="dropdown-divider mb-0"></div>
                    {labsJoined}
                  </>  
                ) : null }  
                
                {(hasLabsPendingApproval) ? (
                  <>
                    <div className="dropdown-divider mt-0"></div>
                    <h6 className="dropdown-header text-light">Labs Pending Approval - <i className="mdi mdi-teach mr-1"/>({labsPendingApproval.length})</h6>
                    <div className="dropdown-divider mb-0"></div>
                    {labsPendingApproval}
                  </>
                ) : null } 

                {(hasLabsNotJoined) ? (
                  <>
                    <div className="dropdown-divider mt-0"></div>
                    <h6 className="dropdown-header text-light">Labs To Join - <i className="mdi mdi-teach mr-1"/>({labsNotJoined.length - labsJoined.length })</h6>
                    <div className="dropdown-divider mb-0"></div>
                    {labsNotJoined}
                  </>
                ) : null }  
                
                <NavbarDropdownLink to={`/labs/new`} className="bg-success text-light">
                  <i className="mdi mdi-teach"/>
                  <i className="mdi mdi-plus mr-2"/>
                  New Lab
                </NavbarDropdownLink>

              </>
            ) : (
              <>
                <div className="dropdown-divider mt-0"></div>
                <h6 className="dropdown-header text-light">All Labs</h6>
                <div className="dropdown-divider mb-0"></div>
                {allLabs}
              </>
            )}  
          </NavbarDropdown>

          {(isLoggedIn) ? (
            <>
              <NavbarLink to="/about">About</NavbarLink>
              <li className="nav-item">
                <a 
                  className="nav-link mr-4" 
                  href="/"
                  onClick={ this.props.logoutCurrentUser }
                >Logout</a>
              </li>
            </>
          ) : (
            <>
              <NavbarLink to="/about">About</NavbarLink>
              <NavbarLink to="/login">Login</NavbarLink>
              <NavbarLink to="/signup">Sign Up</NavbarLink>
            </>
          )}

        </NavbarNav>
      </Navbar>
    );

  }
}

export default withRouter(Navigation);
