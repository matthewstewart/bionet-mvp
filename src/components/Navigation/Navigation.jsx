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
    const labs = this.props.labs;
    const labsJoined = isLoggedIn ? currentUser.labs.map((lab, index) => {
      return (
        <NavbarDropdownLink 
          key={shortid.generate()}
          to={`/labs/${lab._id}`}
        >
          <i className="mdi mdi-teach mr-2"/>{lab.name}
        </NavbarDropdownLink>
      )
    }) : [];
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

          <li className={pathName === '/' ? "nav-item active" : "nav-item"}>
            <Link className="nav-link" to="/">Home</Link>
          </li>

          <NavbarDropdown id="lab-dropdown" label='Labs'>
            

            
            {(isLoggedIn) ? (
              <>
                <h6 className="dropdown-header">My Labs</h6>
                <div className="dropdown-divider"></div>
                {labsJoined}
                <NavbarDropdownLink to={`/labs/new`}>
                  <i className="mdi mdi-teach"/>
                  <i className="mdi mdi-plus mr-2"/>
                  New Lab
                </NavbarDropdownLink>

                <div className="dropdown-divider"></div>
                <h6 className="dropdown-header">Other Labs</h6>
                <div className="dropdown-divider"></div>
                {labsNotJoined}                
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
                  className="nav-link" 
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
