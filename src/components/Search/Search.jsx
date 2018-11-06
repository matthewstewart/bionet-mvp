import React from 'react';
import { Link } from 'react-router-dom';
import shortid from 'shortid';

class Search extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const isLoggedIn = this.props.isLoggedIn;
    const currentUser = this.props.currentUser;
    const virtuals = this.props.virtuals;
    return (

      <div className="Search card rounded-0 mt-3 mb-3">
        <div className="card-header rounded-0 bg-dark text-light">
          <h4 className="card-title mb-0 text-capitalize">
            Search BioNet
          </h4>
        </div>
        <form className="form">
          <div className="input-group rounded-0 ">
            <input 
              type="search" 
              className="form-control rounded-0" 
              placeholder="BioNet Search" aria-label="Search" aria-describedby="search-submit"
            />
            <div className="input-group-append">
              <button className="btn btn-info rounded-0" type="button" id="search-submit">Search</button>
            </div>
          </div>
        </form>
        <div className="card-body">
          Search from {virtuals.length} Virtual Samples currently on BioNet.
        </div>
      </div>

    );
  }
}

export default Search;
