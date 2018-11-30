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
    return (
      <Navbar dark type="dark" className="bg-dark-green">
        <NavbarBrand imgSrc={logo} imgAlt="BioNet Logo" width="40">
        </NavbarBrand>
        <NavbarNav>

          <li className={pathName === '/' ? "nav-item active" : "nav-item"}>
            <Link className="nav-link" to="/">Home</Link>
          </li>
            
          {(isLoggedIn) ? (
            <>
              <NavbarDropdown id="user-dropdown" label={currentUser.username}>
                <h6 className="dropdown-header">Labs</h6>
                <div className="dropdown-divider"></div>
                {labsJoined}
              </NavbarDropdown>
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
