import React from 'react';
import { Link } from 'react-router-dom';
import './LabToolbar.css';

class LabToolbar extends React.Component {
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
                to={`/${routePrefix}/${routeParam}/add/container`}
                className="dropdown-item"
              >
                <i className="mdi mdi-grid mr-2"/>
                Container
              </Link>
              <Link 
                to={`/${routePrefix}/${routeParam}/add/physical`}
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
                to={`/${routePrefix}/${routeParam}/edit`}
                className="dropdown-item"
              >
                <i className="mdi mdi-pencil mr-2"/>
                Edit
              </Link>
              <Link 
                to={`/${routePrefix}/${routeParam}/delete`}
                className="dropdown-item"
              >
                <i className="mdi mdi-delete mr-2"/>
                Delete
              </Link>
              <button 
                className="dropdown-item bg-danger text-light"
                onClick={this.props.onRevokeLabMembership}
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
            className="btn btn-warning rounded-0 disabled"
          >
            <i className="mdi mdi-account-plus mr-1" />
            Membership Pending Approval
          </button>                             
          <button 
            className="btn btn-sm btn-secondary rounded-0"
            onClick={this.props.onCancelRequestLabMembership}
          >
            <i className="mdi mdi-account-plus mr-1" />
            Cancel Request
          </button>
        </div> 
      ) : null }               
    </div>
    );
  }
}

export default LabToolbar;