import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import Auth from '../../modules/Auth';
import appConfig from '../../configuration.js';
//import axios from 'axios';
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import 'react-bootstrap-typeahead/css/Typeahead-bs4.css';
//import { generateRandomName } from '../../modules/Wu';


class PhysicalNewForm extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
      virtual: {},
      form: {
        creator: this.props.currentUser._id || "",
        lab: "",
        parent: "",
        name: "",
        description: "",
        rows: 1,
        columns: 1,
        category: "General",
        bgColor: "#00D1FD",
        locations: [],
        provenance: "",
        genotype: "",
        sequence: ""
      }
    };
    this.handleVirtualChange = this.handleVirtualChange.bind(this);
    this.updateField = this.updateField.bind(this);
    //this.wuGenerate = this.wuGenerate.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.submitForm = this.submitForm.bind(this);
  }

  async postVirtualNew(formData) {
    try {  
      let request = new Request(`${appConfig.apiBaseUrl}/virtuals/new`, {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: new Headers({
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Auth.getToken()}`
        })
      });
      let requestRes = await fetch(request);
      let response = requestRes.json();
      return response;
    } catch (error) {
      console.log('PhysicalNewForm.postVirtualNew', error);
    }   
  }

  async postPhysicalNew(formData) {
    try {  
      let request = new Request(`${appConfig.apiBaseUrl}/physicals/new`, {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: new Headers({
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Auth.getToken()}`
        })
      });
      let requestRes = await fetch(request);
      let response = requestRes.json();
      return response;
    } catch (error) {
      console.log('PhysicalNewForm.postPhysicalNew', error);
    }   
  }

  handleVirtualChange(selectedArray) {
    let virtual = selectedArray[0] || {};
    this.setState({
      virtual
    });
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

  // wuGenerate(e) {
  //   e.preventDefault();
  //   let form = this.state.form;
  //   form.name = generateRandomName();
  //   this.setState({
  //     form
  //   });
  // }

  onFormSubmit(e) {
    e.preventDefault();
    let formData = this.state.form;
    //console.log(formData);
    formData.locations = this.props.newItemLocations;
    let isContainer = this.props.parentType && this.props.parentType === "Container";
    formData.lab = isContainer ? this.props.container.lab._id : this.props.lab._id;
    formData.parent = isContainer ? this.props.container._id : null;    
    let virtualExists = Object.keys(this.state.virtual).length > 0;
    if (virtualExists) {
      // if virtual exists add to form and proceed
      console.log('virtual exists. form:', formData);
      formData.virtual = this.state.virtual._id;
      this.submitForm(formData);
    } else {
      // if virtual does not exist, create and on response add id to form and proceed
      console.log('virtual doesn\'t exist - form:', formData);
      let newVirtual = {
        creator: this.props.currentUser._id,
        name: formData.name,
        description: formData.description,
        provenance: formData.provenance,
        genotype: formData.genotype,
        sequence: formData.sequence,
        category: formData.category,
        datName: "",
        datHash: ""
      };
      this.postVirtualNew(newVirtual)
      .then((res) => {
        let virtual = res.data;
        formData.virtual = virtual._id;
        console.log('virtual created and added - form:', formData);
        this.submitForm(formData);
      });
    }
  }

  submitForm(formData) {
    this.postPhysicalNew(formData)
    .then((res) => {
      console.log('PhysicalNewForm.submitForm.res', res);
      this.setState({
        redirect: true
      });
      this.props.refresh(this.props.currentUser);
    });
  }

  render() { 
    if (this.state.redirect === true) {
      return ( <Redirect to={`/labs/${this.props.lab._id}`}/> )
    }    
    return (
      <div className="row mb-3">
        <div className="col-12">
          <form onSubmit={this.onFormSubmit}>
            <div className="form-group">
              <label htmlFor="virtual">Instance Of:</label>
              <Typeahead
                labelKey="name"
                name="virtual"
                onChange={(selected) => {this.handleVirtualChange(selected)}}
                onPaginate={(e) => console.log('Results paginated')}
                options={this.props.virtuals}
                paginate={true}
                placeholder="Select Existing Virtual Sample (optional)"
                className="border-0"
                maxResults={50}
              />
            </div>

            <div className="form-group">
              <label htmlFor="name">Name</label>
              
              <input 
                type="text" 
                className="form-control"
                id="form-name"
                name="name" 
                placeholder="Physical Name"
                value={this.state.form.name}
                onChange={this.updateField}
              />
            </div>

            {/* <div className="form-group">
              <label htmlFor="bgColor">Background Color</label>       
              <input 
                type="color" 
                className="form-control"
                style={{'height': '50px'}}
                name="bgColor" 
                value={this.state.form.bgColor}
                onChange={this.updateField}
              />
            </div>   */}

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                type="textarea"
                className="form-control"
                name="description"
                placeholder="A short description of the Physical."
                value={this.state.form.description}
                onChange={this.updateField}
              ></textarea>
            </div>
            {(Object.keys(this.state.virtual).length === 0) ? (
              <>
                <div className="form-group">
                  <label htmlFor="provenance">Provenance</label>
                  <input 
                    type="text" 
                    className="form-control"
                    id="form-name"
                    name="provenance" 
                    placeholder="Sample Provenance"
                    value={this.state.form.provenance}
                    onChange={this.updateField}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="genotype">Genotype</label>
                  <input 
                    type="text" 
                    className="form-control"
                    id="form-name"
                    name="genotype" 
                    placeholder="Sample Genotype"
                    value={this.state.form.genotype}
                    onChange={this.updateField}
                  />
                </div>            

                <div className="form-group">
                  <label htmlFor="sequence">Sequence</label>
                  <textarea
                    type="textarea"
                    className="form-control"
                    name="sequence"
                    placeholder="AGTCAGTCAG..."
                    value={this.state.form.sequence}
                    onChange={this.updateField}
                    rows="5"
                  ></textarea>
                </div>
              </>
            ) : null }

            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                type="select"
                className="form-control"
                name="category"
                value={this.state.form.category}
                onChange={this.updateField}
              >
                <option value="Sample">Sample</option>
                <option value="DNA Sample">DNA Sample</option>
                <option value="OrganismSample">Organism Sample</option>
              </select>
            </div>

            <div className="form-group text-center">
              <div className="btn-group">
                {(this.props.parentType && this.props.parentType === "Container") ? (
                  <Link to={`/containers/${this.props.container._id}`} className="btn btn-secondary mt-5">Cancel</Link>
                ) : (
                  <Link to={`/labs/${this.props.lab._id}`} className="btn btn-secondary mt-5">Cancel</Link>
                )}  
                <button type="submit" className="btn btn-success mt-5">Save Physical</button>
              </div>
            </div>
          </form>
        </div>
      </div>    
    );
  }
}

export default PhysicalNewForm;