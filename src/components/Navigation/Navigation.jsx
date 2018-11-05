import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import logo from './images/bionet-logo.png';

class Navigation extends Component {

  render() {
    let pathName = this.props.location.pathname;
    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <Link className="navbar-brand" to="/">
          <img src={logo} alt="BioNet Logo" width="40" height="30"/>
        </Link>
        <button 
          className="navbar-toggler" 
          type="button" 
          data-toggle="collapse" 
          data-target="#navbarSupportedContent" 
          aria-controls="navbarSupportedContent" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ml-auto">
            
            <li className={pathName === '/' ? "nav-item active" : "nav-item"}>
              <Link className="nav-link" to="/">Home</Link>
            </li>
            
            {(this.props.isLoggedIn) ? (
              <li className="nav-item dropdown">
              <a 
                className="nav-link dropdown-toggle text-capitalize" 
                href="/" 
                id="navbarDropdown" 
                role="button" 
                data-toggle="dropdown" 
                aria-haspopup="true" 
                aria-expanded="false"
              >
                {this.props.currentUser.username}
              </a>
              <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                <Link className="dropdown-item" to="/actions/list/labs">List Labs</Link>
              </div>
            </li>
            ) : null }

            {(this.props.isLoggedIn && this.props.currentUser.isAdmin) ? (
              <li className="nav-item dropdown">
              <a 
                className="nav-link dropdown-toggle" 
                href="/" 
                id="navbarDropdown" 
                role="button" 
                data-toggle="dropdown" 
                aria-haspopup="true" 
                aria-expanded="false"
              >
                Admin
              </a>
              <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                <h6 className="dropdown-header">List</h6>
                <div className="dropdown-divider"></div>
                <Link className="dropdown-item" to="/labs">Labs</Link>
                <Link className="dropdown-item" to="/containers">Containers</Link>
                <Link className="dropdown-item" to="/physicals">Physicals</Link>
                <Link className="dropdown-item" to="/virtuals">Virtuals</Link>
              </div>
            </li>
            ) : null }

            { this.props.isLoggedIn ? (
              <li className="nav-item">
                <a 
                  className="nav-link" 
                  href="/"
                  onClick={ this.props.logoutCurrentUser }
                >Logout</a>
              </li>
            ) : (
              <li className="nav-item">
                <Link to="/login" className="nav-link" href="#">Login</Link>
              </li>
            )}

            { !this.props.isLoggedIn ? (
              <li className="nav-item">
                <Link to="/signup" className="nav-link" href="#">Sign Up</Link>
              </li>
            ) : null }
          </ul>

        </div>
      </nav>
    );

  }
}

export default withRouter(Navigation);
