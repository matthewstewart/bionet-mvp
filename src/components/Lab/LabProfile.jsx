import React from 'react';
import { Link } from 'react-router-dom';
import Auth from "../../modules/Auth";
import appConfig from '../../configuration.js';
import shortid from 'shortid';
import './LabProfile.css';

class LabProfile extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      lab: {},
      containers: []
    };
    this.getLab = this.getLab.bind(this);
    this.getData = this.getData.bind(this);
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

    return (
      <div className="LabProfile container-fluid">
        
        <div className="row">
          <div className="col-12 col-lg-6">
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
                  </div>
                </>
              ) : null}   
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default LabProfile;
