import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import Auth from "../../modules/Auth";
import appConfig from '../../configuration.js';
import Grid from '../Grid/Grid';

class LabDelete extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
      lab: {},
      containers: [],
      physicals: [],
      form: {
        name: "",
        description: "",
        rows: 0,
        columns: 0
      }
    };
    this.getLab = this.getLab.bind(this);
    this.postDeleteLab = this.postDeleteLab.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
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
      console.log('LabEdit.getLab', error);
    }  
  }

  async postDeleteLab(labId) {
    try {  
      let request = new Request(`${appConfig.apiBaseUrl}/labs/${labId}/remove`, {
        method: 'POST',
        // body: "deleteit",
        headers: new Headers({
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Auth.getToken()}`
        })
      });
      let labRes = await fetch(request);
      let response = labRes.json();
      return response;
    } catch (error) {
      console.log('LabDelete.postUpdateLab', error);
    }   
  }

  handleDelete() {
    let labId = this.props.match.params.labId;
    console.log('Deleting', labId)
    this.postDeleteLab(labId)
    .then((res) => {
      console.log(res);
      this.setState({
        redirect: true
      });
      this.props.refresh(this.props.currentUser);
    });
  }

  componentDidMount() {
    let labId = this.props.match.params.labId;
    this.getLab(labId)
    .then((res) => {
      console.log('getData.res', res);
      this.setState({
        lab: res.data
      });
    });
  }

  render() {
    if (this.state.redirect === true) {
      return ( <Redirect to={`/`}/> )
    }    
    const isLoggedIn = this.props.isLoggedIn;
    const currentUser = this.props.currentUser;
    const lab = this.state.lab;
    let userIsMember = false;
    if (isLoggedIn) {
      for (let i = 0; i < currentUser.labs.length; i++) {
        let userLab = currentUser.labs[i];
        if (userLab._id === lab._id) { userIsMember = true; }
      }
    }
    return (
      <div className="LabProfile container-fluid">
        
        <div className="row">
          <div className="col-12 col-lg-7">
            <div className="card rounded-0 mt-3">
              <div className="card-header rounded-0 bg-dark text-light">
                <div className="card-title mb-0 text-capitalize">
                  <h4 className="card-title mb-0 text-capitalize">
                    <i className="mdi mdi-teach mr-2"/>Delete Lab
                  </h4>
                </div>
              </div>
              {(isLoggedIn && userIsMember && lab.users.length === 1) ? (         
                <div className="card-body">
                  <p className="card-text">
                    Warning! This action cannot be undone. Are you sure you want to delete this Lab and <strong>all of it's content</strong>?
                  </p>
                  <div className="text-center">
                    <div className="btn-group" role="group" aria-label="Basic example">
                      <Link to={`/labs/${this.props.match.params.labId}`} className="btn btn-secondary mt-3">Back</Link>
                      <button 
                        type="submit" 
                        className="btn btn-danger mt-3"
                        onClick={this.handleDelete}
                      >Delete Lab</button>
                    </div>  
                  </div>                    
                </div>
              ) : (
                <div className="card-body">
                  {(lab && lab.users && lab.users.length > 1) ? (
                    <p className="card-text">
                      Sorry but other Lab Members still exist. Please Leave Lab instead from the settings menu. 
                    </p>
                  ) : null} 
                  {(lab && lab.users && !userIsMember) ? (
                    <p className="card-text">
                      You do not have permission to Delete Lab. 
                    </p>
                  ) : null}  
                </div>
              )}   
            </div>
          </div>
          {(isLoggedIn) ? (
            <div className="col-12 col-lg-5">
              <Grid 
                demo={true}
                editMode={true}
                formData={this.state.form}
                selectLocations={false}
                recordType="Lab"
                record={this.state.form}
                containers={this.state.containers}
                physicals={this.state.physicals}
              />
            </div>
          ) : null }
        </div>
      </div>
    );
  }
}

export default LabDelete;
