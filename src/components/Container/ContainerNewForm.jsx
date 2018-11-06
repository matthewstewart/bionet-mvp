import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
// import Auth from '../../modules/Auth';
// import appConfig from '../../configuration.js';
//import axios from 'axios';
import { generateRandomName } from '../../modules/Wu';
import GridSmall from '../Grid/GridSmall';

class ContainerNewForm extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
      form: {
        creator: this.props.currentUser._id || "",
        lab: this.props.lab._id || "",
        parent: this.props.parentId || null,
        name: "",
        description: "",
        rows: 1,
        columns: 1,
        category: "General",
        bgColor: "#00D1FD",
        locations: []
      }
    };
    this.updateField = this.updateField.bind(this);
    this.wuGenerate = this.wuGenerate.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.submitForm = this.submitForm.bind(this);
  }

  updateField(e) {
    let form = this.state.form;
    let fieldType = e.target.getAttribute('type');
    let field = e.target.getAttribute('name');
    if (fieldType === 'number') {
      form[field] = Number(e.target.value);
    } else {
      form[field] = e.target.value;
    }
    this.setState({
      form
    });
  }

  wuGenerate(e) {
    e.preventDefault();
    let form = this.state.form;
    form.name = generateRandomName();
    this.setState({
      form
    });
  }

  onFormSubmit(e) {
    e.preventDefault();
    let formData = this.state.form;
    //console.log(formData);
    formData.locations = this.props.newItemLocations;
    console.log(formData);
    this.submitForm(formData);
  }

  submitForm(formData) {
    // let config = {
    //   'headers': {
    //     'authorization': `Bearer ${Auth.getToken()}`
    //   },
    //   'json': true
    // };  
    // axios.post(`${appConfig.apiBaseUrl}/containers/new`, formData, config)
    // .then(res => {
    //   console.log('Response:', res.data); 
    //   this.setState({ 
    //     redirect: true 
    //   });
    // })
    // .catch(error => {
    //   console.error(error);
    //   this.setState({ form: formData });
    // }); 
  }

  render() { 
    if (this.state.redirect === true) {
      return ( <Redirect to={`/labs/${this.props.lab._id}`}/> )
    }    
    return (
      <div className="row">
        <div className="col-12 col-lg-6">
          <form onSubmit={this.onFormSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <div className="input-group">
                <input 
                  type="text" 
                  className="form-control"
                  id="form-name"
                  name="name" 
                  placeholder="Container Name"
                  value={this.state.form.name}
                  onChange={this.updateField}
                />
                <div className="input-group-append">
                  <button 
                    className="btn btn-warning"
                    onClick={this.wuGenerate}
                  >Wu Generate</button>
                </div>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="bgColor">Background Color</label>       
              <input 
                type="color" 
                className="form-control"
                style={{'height': '50px'}}
                name="bgColor" 
                value={this.state.form.bgColor}
                onChange={this.updateField}
              />
            </div>            
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                type="textarea"
                className="form-control"
                name="description"
                placeholder="A short description of the Container."
                value={this.state.form.description}
                onChange={this.updateField}
              ></textarea>
            </div>
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                type="select"
                className="form-control"
                name="category"
                value={this.state.form.category}
                onChange={this.updateField}
              >
                <option value="General">General</option>
                <option value="Freezer">Freezer</option>
                <option value="Plate">Plate</option>
              </select>
            </div>            
            <div className="row">
              <div className="col">
                <label htmlFor="columns">Columns</label>
                <input
                  type="number"
                  className="form-control"
                  name="columns"
                  min="1"
                  max="50"
                  step="1"
                  value={this.state.form.columns}
                  onChange={this.updateField}
                />
              </div>
              <div className="col">
                <label htmlFor="rows">Rows</label>
                <input
                  type="number"
                  className="form-control"
                  name="rows"
                  min="1"
                  max="50"
                  step="1"
                  value={this.state.form.rows}
                  onChange={this.updateField}
                />
              </div>  
            </div>
            <div className="form-group text-center">
              <div className="btn-group">
                <Link to={`/`} className="btn btn-secondary mt-5">Cancel</Link>
                <button type="submit" className="btn btn-success mt-5">Save Container</button>
              </div>
            </div>
          </form>
        </div>
        <div className="col-12 col-lg-6">
          <div className="form-group">
            {(this.state.form.name.length > 0) ? (
              <label>{this.state.form.name} Preview</label>
            ) : (
              <label>Container Preview</label>
            )}
            <GridSmall
              demo={true}
              selectLocations={false}
              recordType="Container"
              record={this.state.form}
            />
          </div>
        </div>
      </div>    
    );
  }
}

export default ContainerNewForm;