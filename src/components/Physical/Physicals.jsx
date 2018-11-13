import React, { Component } from 'react';
import Auth from "../../modules/Auth";
import appConfig from '../../configuration.js';
//import { Link } from 'react-router-dom';
import shortid from 'shortid';

class Physicals extends Component {

  constructor(props) {
    super(props);
    this.state = {
      mode: 'List',
      physicals: [],
      physical: {},
      physicalForm: {}
    };
    this.updatePhysical = this.updatePhysical.bind(this);
    this.deletePhysical = this.deletePhysical.bind(this);
    this.onDeletePhysical = this.onDeletePhysical.bind(this);
    this.onChangeMode = this.onChangeMode.bind(this);
    this.changeMode = this.changeMode.bind(this);
    this.updatePhysicalField = this.updatePhysicalField.bind(this);
    this.submitPhysicalForm = this.submitPhysicalForm.bind(this);
    this.handlePhysicalFormSubmit = this.handlePhysicalFormSubmit.bind(this);
  }

  async updatePhysical(formData) {
    try {  
      let request = new Request(`${appConfig.apiBaseUrl}/physicals/${this.state.physical._id}/edit`, {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: new Headers({
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Auth.getToken()}`
        })
      });
      let res = await fetch(request);
      let response = res.json();
      return response;
    } catch (error) {
      console.log('Physicals.updatePhysical', error);
    }   
  }

  async deletePhysical(id) {
    try {  
      let request = new Request(`${appConfig.apiBaseUrl}/physicals/${id}/remove`, {
        method: 'POST',
        //body: JSON.stringify(id),
        headers: new Headers({
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Auth.getToken()}`
        })
      });
      let res = await fetch(request);
      let response = res.json();
      return response;
    } catch (error) {
      console.log('Physicals.deletePhysical', error);
    }   
  }

  onDeletePhysical() {
    this.deletePhysical(this.state.physical._id)
    .then((res) => {
      console.log(res);
      this.props.refresh(this.props.currentUser);
    });    
  }

  onChangeMode(e) {
    let physicals = this.props.physicals;
    let physical = {};
    let physicalForm = {};
    let mode = e.target.getAttribute('mode');
    for(let i = 0; i < physicals.length; i++){
      let thisPhysical = physicals[i];
      if (thisPhysical._id === e.target.id){
        physical = thisPhysical;
        physicalForm = thisPhysical;
      }
    }
    // console.log('Physicals', physicals);
    // console.log('Physical', physical);
    // console.log('Form', form);
    // console.log('Mode', mode);
    this.setState({ 
      physicals,
      physical,
      mode,
      physicalForm 
    });
  }

  changeMode(mode) {
    this.setState({mode});
  }

  updatePhysicalField(e) {
    const field = e.target.name;
    let physicalForm = this.state.physicalForm;
    physicalForm[field] = e.target.value;
    this.setState({
      physicalForm
    });    
  }

  submitPhysicalForm(formData) {
    this.updatePhysical(formData)
    .then((res) => {
      console.log(res);
      this.changeMode('View');
    });
  }

  handlePhysicalFormSubmit(e) {
    e.preventDefault();
    let formData = this.state.physicalForm;
    this.submitPhysicalForm(formData);
  }

  componentDidMount() {

  }  

  render() {
    const mode = this.state.mode;
    const physicals = this.props.physicals || [];
    const physical = this.state.physical;
    const virtual = this.state.physical.virtual;

    let title;
    switch(mode) {
      case 'List':
        title = `Samples (${physicals.length})`;
        break;
      case 'View':
        title = physical.name || "";
        break;
      case 'Edit':
        title = `Edit ${physical.name}`;
        break;
      case 'Delete':
        title = `Delete ${physical.name}`;
        break;
      default:
        title = 'List Physicals';  
    }

    const physicalsList = physicals.map((thisPhysical, index) => {
      return (
        <div 
          key={shortid.generate()}
          className="list-group-item list-group-item-action rounded-0"
        >
          <h4 className="mb-0">
            <i className="mdi mdi-flask mr-2"/>{thisPhysical.name}
            <div className="btn-group float-right">
              <div 
                id={thisPhysical._id}
                mode='View'
                className="btn btn-sm btn-info rounded-0"
                onClick={this.onChangeMode}
              >View Details</div>
            </div>
          </h4>
        </div>        
      );
    });

    return (
      <div className="card rounded-0 mt-3 mb-3">
        <div className="card-header bg-dark text-light rounded-0">
          <h5 className="card-title mb-0 text-capitalize">
            <i className="mdi mdi-flask mr-2"/>{title}
          </h5>
        </div>

        {(mode === 'List') ? (
          <ul className="list-group list-group-flush">
            {physicalsList}
          </ul>
        ) : null }

        {(mode === 'View') ? (
          <div className="card-body">
            <p className="card-text">{physical.description}</p>
            <p className="card-text">Provenance: {physical.virtual.provenance}</p>
            <p className="card-text">Genotype: {physical.virtual.genotype}</p>
            <p className="card-text">Sequence: {physical.virtual.sequence}</p>
            <div className="btn-group">
              <button 
                className="btn btn-secondary"
                onClick={this.onChangeMode}
                mode="List"
              >
                Back To List
              </button>
              <button 
                id={physical._id}
                className="btn btn-primary"
                onClick={this.onChangeMode}
                mode="Edit"
              >
                Edit
              </button>
            </div>
          </div>
        ) : null }

        {(mode === 'Edit') ? (
          <div className="card-body">
            <form className="form" onSubmit={this.handlePhysicalFormSubmit}>
              
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text" 
                  className="form-control"
                  name="name"
                  value={this.state.physicalForm.name}
                  onChange={this.updatePhysicalField}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea 
                  className="form-control"
                  name="description"
                  value={this.state.physicalForm.description}
                  rows="1"
                  onChange={this.updatePhysicalField}
                ></textarea>
              </div>

              <h5 className="card-title">Inherited From Virtual Sample {virtual.name}</h5>
              
              <div className="form-group">
                <label htmlFor="provenance">Provenance</label>
                <input
                  type="text" 
                  className="form-control"
                  value={virtual.provenance}
                  disabled={true}
                />
              </div>

              <div className="form-group">
                <label htmlFor="genotype">Genotype</label>
                <input
                  type="text" 
                  className="form-control"
                  value={virtual.genotype}
                  disabled={true}
                />
              </div>

              <div className="form-group">
                <label htmlFor="sequence">Sequence</label>
                <input
                  type="text" 
                  className="form-control"
                  value={virtual.sequence}
                  disabled={true}
                />
              </div>

              <div className="btn-group mr-3">
                <button 
                  id={physical._id}
                  className="btn btn-secondary"
                  onClick={this.onChangeMode}
                  mode="View"
                >
                  Back To Profile
                </button>
                <button 
                  type="submit"
                  className="btn btn-success"
                >
                  Save Changes
                </button>
                <button 
                  id={physical._id}
                  className="btn btn-danger"
                  onClick={this.onChangeMode}
                  mode="Delete"
                >
                  Delete
                </button>
                
              </div>

              <div className="btn-group">
                <button 
                  id={physical._id}
                  className="btn btn-primary"
                  onClick={this.onChangeMode}
                  mode="Edit Sample"
                >
                  Edit Virtual Sample
                </button>
              </div>

            </form>
          </div>
        ) : null }

        {(mode === 'Delete') ? (
          <div className="card-body">
            <p className="card-text">{physical.description}</p>
            <p className="card-text">
              Warning! This action cannot be undone. Are you sure you want to delete this {physical.name}?
            </p>
            <div className="btn-group">
              <button 
                id={physical._id}
                className="btn btn-secondary"
                onClick={this.onChangeMode}
                mode="Edit"
              >
                Cancel
              </button>
              <button 
                id={physical._id}
                className="btn btn-danger"
                onClick={this.onDeletePhysical}
              >
                Delete
              </button>
            </div>
          </div>
        ) : null }

      </div>
    );
  }
}

export default Physicals;
