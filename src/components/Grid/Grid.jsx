import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import shortid from 'shortid';
import './Grid.css';



function GridContainer(props) {
  const record = props.editMode === true ? props.formData : props.record;
  const gridContainerStyles = {
    'gridTemplateColumns': record ? `repeat(${record.columns}, 1fr)` : '1fr',
    'gridTemplateRows': record ? `repeat(${record.rows}, 1fr)` : '1fr',
  };
  //console.log(props)
  // create empty cells in json
  let gridCellCount = record.columns * record.rows;
  let gridCells = [];
  let positionCounter = 1;
  for(let pos = positionCounter; pos <= gridCellCount; pos++){
    let row = pos > record.columns ? (pos % record.columns === 0) ? parseInt(pos / record.columns) : parseInt(pos / record.columns) + 1 : 1;
    let column = pos > record.columns ? pos % record.columns : pos;
    gridCells.push(
      <EmptyCell 
        key={shortid.generate()} 
        row={row} 
        column={column} 
        selectLocations={props.selectLocations === true}
        newItemLocations={props.newItemLocations || []}
        selectCell={props.selectLocations === true ? props.selectCell : null}
      />);
  }
  // add cells with containers 
  
  for(let i = 0; i < props.containers.length; i++){
    let container = props.containers[i];
    //console.log('grid', container)
    for(let j = 0; j < container.locations.length; j++){
      let locationArray = container.locations[j];
      let column = locationArray[0];
      let row = locationArray[1];
      //console.log(`${container.name} - ${column}, ${row}`)

        gridCells.push(<Cell key={shortid.generate()} row={row} column={column} demo={props.demo === true} container={container}/>);

    }
  } 
  return (
    <>
      <div className="grid-container dropdown" style={gridContainerStyles}>
        { gridCells }
      </div>
    </>
  );
}

function EmptyCell(props) {
  let cellIsSelected = false;
  
  for(let i = 0; i < props.newItemLocations.length; i++){
    let newItemLocation = props.newItemLocations[i];
    if (props.column === newItemLocation[0] && props.row === newItemLocation[1]) {
      cellIsSelected = true;
    }          
  }
  let emptyChildStyles = {
    'display': 'grid',
    'alignSelf': 'stretch',
    'justifySelf': 'stretch',
    'gridTemplateColumns': '1fr',
    'gridTemplateRows': '1fr',
    'gridColumn': `${props.column} / span 1`,
    'gridRow': `${props.row} / span 1`,
  };
  return (
    <div 
      className={cellIsSelected ? 'selected empty grid-item' : 'empty grid-item'}
      isselected={cellIsSelected ? 'true' : 'false'}
      style={emptyChildStyles}
      row={props.row}
      col={props.column}
      //pos={positionCounter}
      data-toggle="tooltip"
      data-placement="top"
      //title={`${props.recordType} ${props.column}, ${props.row} (Empty)`}
      onClick={props.selectCell}
  ></div>     
  );
}

function Cell(props) {
  let cellStyles = {
    'backgroundColor': props.container.bgColor,
    'borderColor': props.container.bgColor,
    'gridColumn': `${props.column} / span 1`,
    'gridRow': `${props.row} / span 1`
  };
  return (
    <>
      {(props.demo === true) ? (
        <div
          key={shortid.generate()}
          style={cellStyles}
          className="lab-container grid-item"
          data-toggle="tooltip"
          data-placement="top"
          title={`Container - ${props.container.name} ${props.column}, ${props.row}`}            
        ></div>
      ) : (
        <Link
          key={shortid.generate()}
          to={`/containers/${props.container._id}`}
          style={cellStyles}
          className="lab-container grid-item"
          data-toggle="tooltip"
          data-placement="top"
          title={`Container - ${props.container.name} ${props.column}, ${props.row}`}            
        ></Link>
      )} 
    </>   
  );
}

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
    //console.log('isSelected', isSelected);
    //console.log(`${col},${row} isselected`, isSelected);
    let isSingleCellSelectMode = this.props.selectSingle === true;
    let newLocationsFull = isSingleCellSelectMode && this.props.newItemLocations.length === 1;
    if (isSingleCellSelectMode) {
      if (isSelected) {
        this.props.removeLocation(location);
      } else if (!newLocationsFull) {
        this.props.addLocation(location);
      }
    } else {
      if (isSelected) {
        this.props.removeLocation(location);
      } else {
        this.props.addLocation(location);
      }      
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
    if (this.props.editMode === true) {
      console.log('edit mode');
    }
  }

  componentWillUnmount() {
    window.$('[data-toggle="tooltip"]').tooltip('dispose');
  }

  render() {
    const newItemLocations = this.props.newItemLocations || [];
    // const containers = this.props.containers || [];
    // const record = this.props.editMode === true ? this.props.formData : this.props.record;
    // const gridContainerStyles = {
    //   'gridTemplateColumns': record ? `repeat(${record.columns}, 1fr)` : '1fr',
    //   'gridTemplateRows': record ? `repeat(${record.rows}, 1fr)` : '1fr',
    // };
    // let gridContainerChildren = [];
    // let positionCounter = 1;


    
    // if (this.props.selectLocations === false) { // select locations false
      
    //   // create empty cells in grid
    //   for(let rowNo = 1; rowNo <= record.rows; rowNo++){
    //     for(let colNo = 1; colNo <= record.columns; colNo++){
    //       let emptyChildStyles = {
    //         'display': 'grid',
    //         'alignSelf': 'stretch',
    //         'justifySelf': 'stretch',
    //         'gridTemplateColumns': '1fr',
    //         'gridTemplateRows': '1fr'
    //       };
    //       //let isSelectedNewLocation = this.props.mode === 'new' && rowNo === Number(this.props.newItemY) && colNo === Number(this.props.newItemX);
    //       gridContainerChildren.push(
    //         <div 
    //           key={shortid.generate()}
    //           className={'empty grid-item'}
    //           style={emptyChildStyles}
    //           row={rowNo}
    //           col={colNo}
    //           pos={positionCounter}
    //           data-toggle="tooltip"
    //           data-placement="top"
    //           title={`${this.props.recordType} ${colNo}, ${rowNo} (Empty)`}
    //           //onDragOver={this.props.onCellDragOver}
    //           //onDrop={!this.props.parentVisible ? this.props.onCellDrop : null}
    //           //draggable={false}
    //           //onClick={this.props.mode === 'new' ? this.props.handleSetNewLocation : null }
    //         ></div> 
    //       );
    //       positionCounter++;
    //     }  
    //   } // end create empty cells
      
    // } else if (this.props.selectLocations) { // select locations true
      
    //   // create empty cells in grid
    //   for(let rowNo = 1; rowNo <= record.rows; rowNo++){
    //     for(let colNo = 1; colNo <= record.columns; colNo++){
    //       let cellIsSelected = false;
    //       for(let i = 0; i < newItemLocations.length; i++){
    //         let newItemLocation = newItemLocations[i];
    //         if (colNo === newItemLocation[0] && rowNo === newItemLocation[1]) {
    //           cellIsSelected = true;
    //         }          
    //       }
    //       let emptyChildStyles = {
    //         'display': 'grid',
    //         'alignSelf': 'stretch',
    //         'justifySelf': 'stretch',
    //         'gridTemplateColumns': '1fr',
    //         'gridTemplateRows': '1fr'
    //       };
    //       //let isSelectedNewLocation = this.props.mode === 'new' && rowNo === Number(this.props.newItemY) && colNo === Number(this.props.newItemX);
    //       gridContainerChildren.push(
    //         <div 
    //           key={shortid.generate()}
    //           className={cellIsSelected ? 'selected empty grid-item' : 'empty grid-item'}
    //           isselected={cellIsSelected ? 'true' : 'false'}
    //           style={emptyChildStyles}
    //           row={rowNo}
    //           col={colNo}
    //           pos={positionCounter}
    //           //onDragOver={this.props.onCellDragOver}
    //           //onDrop={!this.props.parentVisible ? this.props.onCellDrop : null}
    //           //draggable={false}
    //           onClick={this.selectCell}
    //         ></div> 
    //       );
    //       positionCounter++;  
    //     }  
    //   } // end create empty cells

    // }// end if/else select locations

    // // replace empty grid cells with child containers
    // for(let i = 0; i < containers.length; i++){
    //   //let childIndex =  ((child.parent_y * gridContainerWidth) - gridContainerWidth) + child.parent_x - 1;
    //   let container = containers[i];
    //   for(let j = 0; j < container.locations.length; j++) {
    //     let location = container.locations[j];
    //     location['column'] = location[0];
    //     location['row'] = location[1];
    //     let gridWidth = record.columns;
    //     let gridHeight = record.rows;
    //     let locationIndex = ((location.row * gridHeight) - gridWidth) + location.column - 1;
    //     let containerLink;
    //     if (this.props.demo === true){
    //       containerLink = (
    //         <div
    //           key={shortid.generate()}
    //           style={{
    //             'backgroundColor': container.bgColor,
    //             'borderColor': container.bgColor
    //           }}
    //           className="lab-container grid-item"
    //           data-toggle="tooltip"
    //           data-placement="top"
    //           title={`Container - ${container.name} ${location.column}, ${location.row}`}            
    //         ></div>
    //       );
    //     } else  {
    //       containerLink = (
    //         <Link
    //           key={shortid.generate()}
    //           to={`/containers/${container._id}`}
    //           style={{
    //             'backgroundColor': container.bgColor,
    //             'borderColor': container.bgColor
    //           }}
    //           className="lab-container grid-item"
    //           data-toggle="tooltip"
    //           data-placement="top"
    //           title={`Container - ${container.name} ${location.column}, ${location.row}`}            
    //         ></Link>
    //       );
    //     }
    //     gridContainerChildren[locationIndex] = containerLink;
    //   }
    // }



    return (
      <div className="card rounded-0 mt-3 mb-3">
        <div className="card-header bg-dark text-light rounded-0">
          <h4 className="card-title mb-0 text-capitalize">
            {this.props.record.name || `(Select A ${this.props.recordType} Name)`}
          </h4>
        </div>
        <div className="card-body">
          <GridContainer 
            selectCell={this.selectCell}
            containers={this.props.containers} 
            record={this.props.record} 
            newItemLocations={newItemLocations}
            {...this.props}/>       
        </div>
      </div>
    );
  }
}

export default Grid;
