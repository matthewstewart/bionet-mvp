import React, { Component } from 'react';
//import { Link } from 'react-router-dom';
import shortid from 'shortid';

class Physicals extends Component {

  constructor(props) {
    super(props);
    this.state = {
      mode: 'List',
      physicals: [],
      physical: {},
      form: {}
    };
    this.onChangeMode = this.onChangeMode.bind(this);
  }

  onChangeMode(e) {
    let physicals = this.props.physicals;
    let physical = {};
    let form = {};
    let mode = e.target.getAttribute('mode');
    for(let i = 0; i < physicals.length; i++){
      let thisPhysical = physicals[i];
      if (thisPhysical._id === e.target.id){
        physical = thisPhysical;
        form = thisPhysical;
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
      form 
    });
  }

  componentDidMount() {

  }  

  render() {
    const mode = this.state.mode;
    const physicals = this.props.physicals || [];
    const physical = this.state.physical;

    let title;
    switch(mode) {
      case 'List':
        title = `Samples (${physicals.length})`;
        break;
      case 'View':
        title = this.state.physical.name || "";
        break;
      case 'Edit':
        title = 'Edit Physical';
        break;
      case 'Delete':
        title = 'Delete Physical';
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
            </div>
          </div>
        ) : null }
      </div>
    );
  }
}

export default Physicals;
