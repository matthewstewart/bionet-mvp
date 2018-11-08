import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import Auth from "../../modules/Auth";
import appConfig from '../../configuration.js';
import Grid from '../Grid/Grid';

class LabNew extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
      lab: {},
      form: {
        name: "",
        description: "",
        rows: 1, 
        columns: 1
      }
    };
    this.postNewLab = this.postNewLab.bind(this);
    this.updateField = this.updateField.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  async postNewLab(lab) {
    try {  
      let labRequest = new Request(`${appConfig.apiBaseUrl}/labs/new`, {
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
      console.log('LabNew.postNewLab', error);
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
    console.log(formData);
    this.postNewLab(formData)
    .then((res) => {
      console.log('post new lab res', res);
      this.props.refresh(this.props.currentUser);
      this.setState({
        redirect: true
      });
    });
  }

  handleFormSubmit(e) {
    e.preventDefault();
    let form = this.state.form;
    this.setState({
      form: {
        name: "",
        description: "",
        rows: 1, 
        columns: 1            
      }
    });
    this.submitForm(form);
  }

  render() {
    const isLoggedIn = this.props.isLoggedIn;
    let form = this.state.form;
    let formValid = form.name.length > 0 && form.rows > 1 && form.columns > 1;
    if (this.state.redirect === true) {
      return ( <Redirect to={`/`}/> )
    }
    return (
      <div className="LabProfile container-fluid">
        
        <div className="row">
          <div className="col-12 col-lg-7">
            <div className="card rounded-0 mt-3">
              <div className="card-header rounded-0 bg-dark text-light">
                <div className="card-title mb-0 text-capitalize">
                  <h4 className="card-title mb-0 text-capitalize">
                    <i className="mdi mdi-teach mr-2"/ >New Lab
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
                          <Link to="/" className="btn btn-secondary mt-3">Back</Link>
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
                selectLocations={false}
                recordType="Lab"
                record={this.state.form}
                containers={[]}
                physicals={[]}
              />
            </div>
          ) : null }
        </div>
      </div>
    );
  }
}

export default LabNew;
