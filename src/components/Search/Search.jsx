import React from 'react';
//import { Link } from 'react-router-dom';
import shortid from 'shortid';
import { Card, CardHeader, CardTitle, CardBody, CardText, CardList, CardListLink } from '../Bootstrap/components';
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import 'react-bootstrap-typeahead/css/Typeahead-bs4.css';

class Search extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selected: {},
      fullSequence: false,
      physicals: []
    };
    this.handleChange = this.handleChange.bind(this);
    this.toggleFullSequence = this.toggleFullSequence.bind(this);
  }

  handleChange(selectedArray) {
    let allPhysicals = this.props.physicals;
    let selected = selectedArray[0];
    console.log('selected', selected);
    //console.log('allPhysicals', allPhysicals);
    let physicals = [];
    for(let i = 0; i < allPhysicals.length; i++){
      let physical = allPhysicals[i];
      if (selected && physical.virtual && physical.virtual._id === selected._id){
        physicals.push(physical);
      }
    }
    console.log('physicals', physicals);
    this.setState({
      selected,
      physicals
    });
  }

  toggleFullSequence() {
    this.setState({
      fullSequence: !this.state.fullSequence
    });
  }

  render() {
    //const isLoggedIn = this.props.isLoggedIn;
    //const currentUser = this.props.currentUser;
    const virtuals = this.props.virtuals;
    const virtualIsSelected = this.state.selected && Object.keys(this.state.selected).length > 0;
    const virtualSelected = this.state.selected;

    const physicals = this.state.physicals.map((physical) => {
      return (
        <CardListLink 
          key={shortid.generate()}
          dark
          type="info"
          to={`/containers/${physical.parent._id}`}
        >
          <i className="mdi mdi-flask mr-2"/>{physical.name}
        </CardListLink>
      );
    });

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
          <Card className="search-result mt-3 mb-3">
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
                Sequence: 
              </CardText>
              <Sequence 
                fullSequence={this.state.fullSequence} 
                virtual={virtualSelected}
                toggleFullSequence={this.toggleFullSequence}
              />
            </CardBody>
            <CardList>
              {physicals}
            </CardList>
          </Card>
        ) : null }  
      </>
    );
  }
}

export default Search;

function Sequence(props) {
  return (
    <>
      {(props.fullSequence) ? (
        <>
          <div>{props.virtual.sequence}</div>
          <div className="btn btn-sm btn-primary ml-3" onClick={props.toggleFullSequence}>Collapse</div>
        </>
      ) : (
        <div>
          {truncString(props.virtual.sequence, 80)}
          <div className="btn btn-sm btn-primary ml-3" onClick={props.toggleFullSequence}>Expand</div>
        </div>
      )}
    </>
  );
};

function truncString(str, len) {
  return (str.length > len) ? str.substr(0, len - 1) + '...' : str;
}

