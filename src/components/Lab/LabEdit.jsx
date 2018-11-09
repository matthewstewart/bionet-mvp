import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import Auth from "../../modules/Auth";
import appConfig from '../../configuration.js';
import Grid from '../Grid/Grid';

class LabEdit extends React.Component {

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
    this.postUpdateLab = this.postUpdateLab.bind(this);
    this.updateField = this.updateField.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
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

  async postUpdateLab(formData) {
    try {  
      let labRequest = new Request(`${appConfig.apiBaseUrl}/labs/${this.state.lab._id}/edit`, {
        method: 'POST',
        body: JSON.stringify(formData),
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
      console.log('LabEdit.postUpdateLab', error);
    }   
  }

  updateField(e) {
    const field = e.target.name;
    let form = this.state.form;
    if(field === 'rows' || field === 'columns') {
      form[field] = Number(e.target.value);
    } else {
      form[field] = e.target.value;
    }
    this.setState({
      form
    });    
  }

  submitForm(formData) {
    // if(formData.name.length > 0){
    //   let config = {
    //     'headers': {
    //       'authorization': `Bearer ${Auth.getToken()}`
    //     },
    //     'json': true
    //   };  
    //   axios.post(`${appConfig.apiBaseUrl}/labs/new`, formData, config)
    //   .then(res => {     
    //     this.setState({ 
    //       lab: res.data.data,
    //       redirect: true 
    //     });
    //     this.props.setAlert("success", `${this.state.lab.name} was successfully created.`);
    //   })
    //   .catch(error => {
    //     console.error(error);
    //     this.setState({ form: formData });
    //   });      
    // }
    this.postUpdateLab(formData)
    .then((res) => {
      console.log(res);
      this.setState({
        redirect: true
      });
      this.props.refresh(this.props.currentUser);
    });
  }

  handleFormSubmit(e) {
    e.preventDefault();
    let formData = this.state.form;
    this.submitForm(formData);
  }

  componentDidMount() {
    let labId = this.props.match.params.labId;
    this.getLab(labId)
    .then((res) => {
      console.log('getData.res', res);
      this.setState({
        lab: res.data,
        containers: res.children,
        physicals: res.physicals,
        form: res.data
      });
    });
  }

  render() {
    const isLoggedIn = this.props.isLoggedIn;
    let form = this.state.form;
    let formValid = form.name.length > 0 && form.rows > 1 && form.columns > 1;
    if (this.state.redirect === true) {
      return ( <Redirect to={`/labs/${this.props.match.params.labId}`}/> )
    }
    return (
      <div className="LabProfile container-fluid">
        
        <div className="row">
          <div className="col-12 col-lg-7">
            <div className="card rounded-0 mt-3">
              <div className="card-header rounded-0 bg-dark text-light">
                <div className="card-title mb-0 text-capitalize">
                  <h4 className="card-title mb-0 text-capitalize">
                    <i className="mdi mdi-teach mr-2"/ >Edit Lab
                  </h4>
                </div>
              </div>
              {(isLoggedIn) ? (
                <>
                  <div className="card-body">
                    <form onSubmit={this.handleFormSubmit}>
                      <input 
                        name="creator"
                        type="hidden"
                        value={this.props.currentUser._id}
                      />
                      <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input 
                          name="name"
                          className="form-control"
                          value={this.state.form.name}
                          onChange={this.updateField}
                          placeholder="Lab Name"
                        />
                        <small className="form-text text-muted">Required - The name of your Lab. This will be public and visible to other Labs.</small>
                      </div>

                      <div className="form-group">
                        <label htmlFor="name">Description</label>
                        <input 
                          name="description"
                          type="text"
                          className="form-control"
                          value={this.state.form.description}
                          onChange={this.updateField}
                          placeholder="A short description of the Lab."
                        />
                        <small className="form-text text-muted">Optional - Share a bit more detail on your Lab. Visible to the public and other Labs.</small>
                      </div>

                      <div className="form-group">
                        <label htmlFor="name">Columns</label>
                        <input 
                          name="columns"
                          type="number"
                          className="form-control"
                          value={this.state.form.columns}
                          onChange={this.updateField}
                          min="1"
                          max="50"
                          step="1"
                        />
                        <small className="form-text text-muted">
                          Required - The number of columns in the grid representing your Lab area from a top-down view. Change to a value greater than 1.
                        </small>
                      </div>

                      <div className="form-group">
                        <label htmlFor="name">Rows</label>
                        <input 
                          name="rows"
                          type="number"
                          className="form-control"
                          value={this.state.form.rows}
                          onChange={this.updateField}
                          min="1"
                          max="50"
                          step="1"
                        />
                        <small className="form-text text-muted">Required - The number of rows in the grid representing your Lab area from a top-down view. Change to a value greater than 1.</small>
                      </div>

                      <div className="form-group text-center">
                        <div className="btn-group" role="group" aria-label="Basic example">
                          <Link to={`/labs/${this.props.match.params.labId}`} className="btn btn-secondary mt-3">Back</Link>
                          <button 
                            type="submit" 
                            className="btn btn-success mt-3"
                            disabled={!formValid}
                          >Submit</button>
                        </div>  
                      </div>                    

                    </form>
                  </div>
                </>
              ) : null}   
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

export default LabEdit;
