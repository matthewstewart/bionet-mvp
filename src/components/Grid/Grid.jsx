import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import shortid from 'shortid';
import './Grid.css';


class Grid extends Component {

  constructor(props) {
    super(props);
    this.state = {};
    this.selectCell = this.selectCell.bind(this);
  }

  selectCell(e) {
    let row = Number(e.target.getAttribute('row'));
    let col = Number(e.target.getAttribute('col'));
    let location = [col,row];
    //console.log('clicked location', location);
    let isSelected = e.target.getAttribute('isselected') === 'true';
    console.log(`${col},${row} isselected`, isSelected);
    if (isSelected) {
      this.props.removeLocation(location);
    } else {
      this.props.addLocation(location);
    }
    // if (isSelected === 'false') {
    //   this.props.removeLocation(location);
    // } else {
    //   this.props.addLocation(location);
    // }
  }

  componentDidMount() {
    window.$('[data-toggle="tooltip"]').tooltip();
  }  
  
  componentDidUpdate() {
    window.$('[data-toggle="tooltip"]').tooltip();
  }

  componentWillUnmount() {
    window.$('[data-toggle="tooltip"]').tooltip('dispose');
  }

  render() {
    const newItemLocations = this.props.newItemLocations || [];
    const containers = this.props.containers || [];
    const record = this.props.record || null;
    const gridContainerStyles = {
      'gridTemplateColumns': record ? `repeat(${record.columns}, 1fr)` : '1fr',
      'gridTemplateRows': record ? `repeat(${record.rows}, 1fr)` : '1fr',
    };
    let gridContainerChildren = [];
    let positionCounter = 1;

    if (this.props.selectLocations === false) {
      for(let rowNo = 1; rowNo <= record.rows; rowNo++){
        for(let colNo = 1; colNo <= record.columns; colNo++){
          let emptyChildStyles = {
            'display': 'grid',
            'alignSelf': 'stretch',
            'justifySelf': 'stretch',
            'gridTemplateColumns': '1fr',
            'gridTemplateRows': '1fr'
          };
          //let isSelectedNewLocation = this.props.mode === 'new' && rowNo === Number(this.props.newItemY) && colNo === Number(this.props.newItemX);
          gridContainerChildren.push(
            <div 
              key={shortid.generate()}
              className={'empty grid-item'}
              style={emptyChildStyles}
              row={rowNo}
              col={colNo}
              pos={positionCounter}
              data-toggle="tooltip"
              data-placement="top"
              title={`${this.props.recordType} ${colNo}, ${rowNo} (Empty)`}
              //onDragOver={this.props.onCellDragOver}
              //onDrop={!this.props.parentVisible ? this.props.onCellDrop : null}
              //draggable={false}
              //onClick={this.props.mode === 'new' ? this.props.handleSetNewLocation : null }
            ></div> 
          );
          positionCounter++;
        }  
      }
    } else if (this.props.selectLocations) {
      for(let rowNo = 1; rowNo <= record.rows; rowNo++){
        for(let colNo = 1; colNo <= record.columns; colNo++){
          let cellIsSelected = false;
          for(let i = 0; i < newItemLocations.length; i++){
            let newItemLocation = newItemLocations[i];
            if (colNo === newItemLocation[0] && rowNo === newItemLocation[1]) {
              cellIsSelected = true;
            }          
          }
          let emptyChildStyles = {
            'display': 'grid',
            'alignSelf': 'stretch',
            'justifySelf': 'stretch',
            'gridTemplateColumns': '1fr',
            'gridTemplateRows': '1fr'
          };
          //let isSelectedNewLocation = this.props.mode === 'new' && rowNo === Number(this.props.newItemY) && colNo === Number(this.props.newItemX);
          gridContainerChildren.push(
            <div 
              key={shortid.generate()}
              className={cellIsSelected ? 'selected empty grid-item' : 'empty grid-item'}
              isselected={cellIsSelected ? 'true' : 'false'}
              style={emptyChildStyles}
              row={rowNo}
              col={colNo}
              pos={positionCounter}
              //onDragOver={this.props.onCellDragOver}
              //onDrop={!this.props.parentVisible ? this.props.onCellDrop : null}
              //draggable={false}
              onClick={this.selectCell}
            ></div> 
          );
          positionCounter++;  
        }  
      }      
    }
    // replace empty grid cells with child containers
    for(let i = 0; i < containers.length; i++){
      //let childIndex =  ((child.parent_y * gridContainerWidth) - gridContainerWidth) + child.parent_x - 1;
      let container = containers[i];
      for(let j = 0; j < container.locations.length; j++) {
        let location = container.locations[j];
        location['column'] = location[0];
        location['row'] = location[1];
        let gridWidth = record.columns;
        let gridHeight = record.rows;
        let locationIndex = ((location.row * gridHeight) - gridWidth) + location.column - 1;
        let containerLink = (
          <Link
            key={shortid.generate()}
            to={`/containers/${container._id}`}
            style={{
              'backgroundColor': container.bgColor,
              'borderColor': container.bgColor
            }}
            className="lab-container grid-item"
            data-toggle="tooltip"
            data-placement="top"
            title={`Container - ${container.name} ${location.column}, ${location.row}`}            
          ></Link>
        );
        gridContainerChildren[locationIndex] = containerLink;
      }
    }
    return (
      <div className="card rounded-0 mt-3">
        <div className="card-header bg-dark text-light rounded-0">
          <h4 className="card-title mb-0 text-capitalize">
            {this.props.record.name.length > 0 ? this.props.record.name : (this.props.demo ? `(Select A ${this.props.recordType} Name)` : "Loading...")}
          </h4>
        </div>
        <div className="card-body">
          <div className="grid-container dropdown" style={gridContainerStyles}>
            {gridContainerChildren}
          </div>
        </div>
      </div>
    );
  }
}

export default Grid;
