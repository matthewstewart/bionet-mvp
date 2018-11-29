import React from 'react';
//import { Link } from 'react-router-dom';
//import shortid from 'shortid';
import { Card, CardHeader, CardTitle, CardBody, CardText } from '../Bootstrap/components';
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
    console.log(selected);
    this.setState({
      selected
    });
  }

  render() {
    //const isLoggedIn = this.props.isLoggedIn;
    //const currentUser = this.props.currentUser;
    const virtuals = this.props.virtuals;
    const virtualIsSelected = this.state.selected && Object.keys(this.state.selected).length > 0;
    const virtualSelected = this.state.selected;
    return (
      <>
        <Card className="Search mt-3">
          <CardHeader dark className="bg-dark-green">
            <CardTitle>Search BioNet</CardTitle>
          </CardHeader>
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
                <button className="btn btn-info rounded-0" type="button" id="search-submit" disabled={true}>Search</button>
              </div>
            </div>
          </form>
          {(!virtualIsSelected) ? (
            <CardBody>
              <CardText>Search from {virtuals.length} Virtual Samples</CardText>
            </CardBody>
          ) : null}  
        </Card>
        
        {(virtualIsSelected) ? (
          <Card className="Search mt-3 mb-3">
            <CardHeader dark className="bg-dark-green">
              <h4 className="card-title mb-0 text-capitalize">
                <i className="mdi mdi-dna mr-2"/>{virtualSelected.name}
              </h4>
            </CardHeader>
            <CardBody>
              <CardText>{virtualSelected.description}</CardText>
              <CardText>
                Available: {virtualSelected.isAvailable ? "Yes" : "No"}<br/>
                Provenance: {virtualSelected.provenance}<br/>
                Genotype: {virtualSelected.genotype}<br/>
                Sequence: {virtualSelected.sequence}<br/>
              </CardText>
            </CardBody>
          </Card>
        ) : null }  
      </>
    );
  }
}

export default Search;

// function range(start, end) {
//   if(start === end) return [start];
//   return [start, ...range(start + 1, end)];
// }
