import React from 'react';
import { Link } from 'react-router-dom';
import './GridToolbar.scss';

class GridToolbar extends React.Component {
  render() {
    const isLoggedIn = this.props.isLoggedIn;
    const currentUser = this.props.currentUser;
    const lab = this.props.lab;
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
    
    const routePrefix = this.props.type === "Lab" ? "labs" : "containers";
    const routeParam = this.props.type === "Lab" ? this.props.match.params.labId : this.props.match.params.containerId;
    return (
      <div id="heading-toolbar" className="btn-group" role="group">
      {(userIsMember) ? (
      
        <div className="btn-group" role="group">                           
          <Link 
            to={`/${routePrefix}/${routeParam}/add/container`}
            className="btn btn-success rounded-0"
          >
            <i className="mdi mdi-plus-box mr-1"/>
            <i className="mdi mdi-grid"/>
          </Link>
          <Link 
            to={`/${routePrefix}/${routeParam}/add/physical`}
            className="btn btn-info rounded-0"
          >
            <i className="mdi mdi-plus-box mr-1"/>
            <i className="mdi mdi-flask"/>
          </Link>
          <Link 
              to={`/${routePrefix}/${routeParam}/edit`}
              className="btn btn-primary rounded-0"
            >
              <i className="mdi mdi-settings-box mr-1"/>
              <i className={this.props.iconClasses}/>
            </Link>
        </div>
        
      ) : null }
      {(!userIsMember && !userIsRequestingMembership) ? (
        <div className="btn-group" role="group">
          <button  
            className="btn btn-success rounded-0"
            onClick={this.props.onRequestLabMembership}
          >
            <i className="mdi mdi-account-plus mr-1" />
            Request Membership
          </button>

        </div> 
      ) : null }
      {(userIsRequestingMembership) ? (
        <div className="btn-group" role="group">                            
          <button 
            className="btn btn-sm btn-warning rounded-0"
            onClick={this.props.onCancelRequestLabMembership}
          >
            <i className="mdi mdi-account-plus mr-1" />
            Cancel Membership Request
          </button>
        </div> 
      ) : null }               
    </div>
    );
  }
}

export default GridToolbar;