import React from 'react';
import { Link } from 'react-router-dom';
import shortid from 'shortid';
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import 'react-bootstrap-typeahead/css/Typeahead-bs4.css';

class Search extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selected: {}
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(selectedArray) {
    let selected = selectedArray[0];
    this.setState({
      selected
    });
  }

  render() {
    const isLoggedIn = this.props.isLoggedIn;
    const currentUser = this.props.currentUser;
    const virtuals = this.props.virtuals;
    const virtualIsSelected = this.state.selected && Object.keys(this.state.selected).length > 0;
    const virtualSelected = this.state.selected;
    return (
      <>
        <div className="Search card rounded-0 mt-3">
          <div className="card-header rounded-0 bg-dark text-light">
            <h4 className="card-title mb-0 text-capitalize">
              Search BioNet
            </h4>
          </div>
          <form className="form">
            <div className="input-group rounded-0 ">
              <Typeahead
                labelKey="name"
                name="search"
                onChange={(selected) => {this.handleChange(selected)}}
                onPaginate={(e) => console.log('Results paginated')}
                options={virtuals}
                paginate={true}
                placeholder="Search BioNet"
                className="border-0"
                maxResults={50}
              />
              <div className="input-group-append">
                <button className="btn btn-info rounded-0" type="button" id="search-submit">Search</button>
              </div>
            </div>
          </form>
          {(!virtualIsSelected) ? (
            <div className="card-body">
              Search from {virtuals.length} Virtual Samples currently on BioNet.
            </div>
          ) : null}  
        </div>
        
        {(virtualIsSelected) ? (
          <div className="Search card rounded-0 mt-3 mb-3">
            <div className="card-header rounded-0 bg-dark text-light">
              <h4 className="card-title mb-0 text-capitalize">
                <i className="mdi mdi-dna mr-2"/>{virtualSelected.name}
              </h4>
            </div>
            <div className="card-body">
              <p className="card-text">
                {virtualSelected.description}
              </p>
              <p className="card-text">
                Available: {virtualSelected.isAvailable ? "Yes" : "No"}<br/>
                Provenance: {virtualSelected.provenance}<br/>
                Genotype: {virtualSelected.genotype}<br/>
                Sequence: {virtualSelected.sequence}<br/>
              </p>
            </div>
          </div>
        ) : null }  
      </>
    );
  }
}

export default Search;

function range(start, end) {
  if(start === end) return [start];
  return [start, ...range(start + 1, end)];
}
