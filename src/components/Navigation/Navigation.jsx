import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Navbar, NavbarBrand, NavbarNav, NavbarLink, NavbarDropdown, NavbarDropdownLink } from '../Bootstrap/components';
import shortid from 'shortid';
import logo from './images/bionet-logo.png';

class Navigation extends Component {

  render() {
    let pathName = this.props.location.pathname;
    const isLoggedIn = this.props.isLoggedIn;
    const currentUser = this.props.currentUser;
    const labs = this.props.labs || [];
    const labsJoined = isLoggedIn ? currentUser.labs.map((lab, index) => {
      return (
        <>
          {(index > 0) ? ( <div className="dropdown-divider mt-0"></div> ) : null }
          <h6 className="dropdown-header">{lab.name} - <i className="mdi mdi-account"/>({lab.users.length})</h6>
          <div className="dropdown-divider mb-0"></div>
          <NavbarDropdownLink 
            key={shortid.generate()}
            to={`/labs/${lab._id}`}
            className="bg-info text-light"
          >
            <i className="mdi mdi-eye mr-2"/>View
          </NavbarDropdownLink>
          <NavbarDropdownLink 
            key={shortid.generate()}
            to={`/labs/${lab._id}/edit`}
            className="bg-primary text-light"
          >
            <i className="mdi mdi-pencil mr-2"/>Edit
          </NavbarDropdownLink>
        </>
      )
    }) : [];
    const hasLabsJoined = isLoggedIn && currentUser && currentUser.labs && currentUser.labs.length > 0;
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
        >
          <i className="mdi mdi-teach mr-2"/>{lab.name}
        </NavbarDropdownLink>
      )
    });
    return (
      <Navbar dark type="dark" className="bg-dark-green">
        <NavbarBrand imgSrc={logo} imgAlt="BioNet Logo" width="40">
        </NavbarBrand>
        <NavbarNav>

          <NavbarDropdown id="lab-dropdown" label={currentUser.username}>
            
            {(isLoggedIn) ? (
              <>
                {(hasLabsJoined) ? (labsJoined) : null }  
                
                {(hasLabsNotJoined) ? (
                  <>
                    <div className="dropdown-divider mt-0"></div>
                    <h6 className="dropdown-header">Labs - <i className="mdi mdi-teach mr-1"/>({labsNotJoined.length})</h6>
                    <div className="dropdown-divider"></div>
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
                <h6 className="dropdown-header">All Labs</h6>
                <div className="dropdown-divider"></div>
                {allLabs}
              </>
            )}  
          </NavbarDropdown>

          {(isLoggedIn) ? (
            <>
              {/* <NavbarDropdown id="user-dropdown" className="text-capitalize" label={currentUser.username}>
                <h6 className="dropdown-header">My Labs</h6>
                <div className="dropdown-divider"></div>
                {labsJoined}
              </NavbarDropdown> */}
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
