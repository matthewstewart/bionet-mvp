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
    this.getRandomVirtual = this.getRandomVirtual.bind(this);
  }

  handleChange(selectedArray) {
    let allPhysicals = this.props.physicals;
    let selected = selectedArray[0];
    //console.log('selected', selected);
    //console.log('allPhysicals', allPhysicals);
    let physicals = [];
    for(let i = 0; i < allPhysicals.length; i++){
      let physical = allPhysicals[i];
      if (selected && physical.virtual && physical.virtual._id === selected._id){
        physicals.push(physical);
      }
    }
    //console.log('physicals', physicals);
    this.setState({
      selected,
      physicals
    });
  }

  getRandomVirtual() {
    let virtuals = this.props.virtuals;
    let index = getRandomInt(0, virtuals.length - 1);
    //console.log(index);
    let selected = virtuals[index];
    //console.log(virtual);
    this.setState({selected});
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
        <Card className="Search text-center">
          <CardHeader dark className="bg-dark-green">
            <CardTitle><i className="mdi mdi-dna mr-2"/>Search</CardTitle>
          </CardHeader>
          <form className="form">
            <div className="input-group rounded-0" id="search-input">
              <Typeahead
                labelKey="name"
                name="search"
                onChange={(selected) => {this.handleChange(selected)}}
                // onPaginate={(e) => console.log('Results paginated')}
                options={virtuals}
                // paginate={true}
                placeholder="<type here>"
                className="border-0"
                maxResults={50}
                selected={virtualIsSelected > 0 ? [this.state.selected] : []}
              />
              <div className="input-group-append">
                <button 
                  className="btn btn-warning rounded-0" 
                  type="button" 
                  id="feeling-random"
                  onClick={this.getRandomVirtual}
                >
                  <i className="mdi mdi-dice-multiple mr-2"/>Feeling Random
                </button>
              </div>
            </div>
          </form>
          {(!virtualIsSelected) ? (
            <CardBody>
              <CardText>from {virtuals.length} primers, plasmids, strains, cells, samples, and more...</CardText>
            </CardBody>
          ) : null}  
        </Card>
        
        {(virtualIsSelected) ? (
          <Card className="search-result mt-3 mb-3 text-center">
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
            <CardHeader dark className="bg-dark-green">
              <h4 className="card-title mb-0 text-capitalize">
                <i className="mdi mdi-flask mr-2"/>Instances Of {virtualSelected.name}
              </h4>
            </CardHeader>
            {(physicals.length > 0) ? (
              <CardList>
                {physicals}
              </CardList>
            ) : (
              <CardBody>
                <CardText>There are currently no physical instances of {virtualSelected.name}</CardText>
              </CardBody>
            )}  
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

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}