import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import shortid from 'shortid';
import GridToolbar from './GridToolbar';
import './Grid.css';



function GridContainer(props) {
  const record = props.editMode === true ? props.formData : props.record;
  const gridContainerStyles = {
    'gridTemplateColumns': record ? `repeat(${record.columns}, 1fr)` : '1fr',
    'gridTemplateRows': record ? `repeat(${record.rows}, 1fr)` : '1fr',
    'height': record ? `${record.rows * 40}px` : '0px',
    'width': record ? `${record.columns * 40}px` : '0px',
  };
  //console.log(props)
  // create empty cells in json
  let gridCellCount = record.columns * record.rows;
  let gridCells = [];
  let positionCounter = 1;
  for(let pos = positionCounter; pos <= gridCellCount; pos++){
    let row = pos > record.columns ? (pos % record.columns === 0) ? parseInt(pos / record.columns) : parseInt(pos / record.columns) + 1 : 1;
    let column = pos > record.columns ? pos % record.columns : pos;
    if (column === 0) { column = record.columns }
    gridCells.push(
      <EmptyCell 
        key={shortid.generate()} 
        row={row} 
        column={column} 
        selectLocations={props.selectLocations === true}
        newItemLocations={props.newItemLocations || []}
        selectCell={props.selectLocations === true ? props.selectCell : null}
        onCellDrop={props.onCellDrop}
        onCellDragOver={props.onCellDragOver}
        //onCellDragEnd={props.onCellDragEnd}
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
      gridCells.push(
        <Cell 
          key={shortid.generate()} 
          row={row} 
          column={column} 
          demo={props.demo === true} 
          routePrefix="/containers"
          cellType="Container"
          item={container}
          onCellDragStart={props.onCellDragStart}
          //onCellDragEnd={props.onCellDragEnd}
        />
      );
    }
  } 
  // add cells with physicals
  for(let i = 0; i < props.physicals.length; i++){
    let physical = props.physicals[i];
    //console.log('grid.addPhysicalCells.physical', physical)
    for(let j = 0; j < physical.locations.length; j++){
      let locationArray = physical.locations[j];
      let column = locationArray[0];
      let row = locationArray[1];
      //console.log(`${physical.name} - ${column}, ${row}`)
      gridCells.push(
        <Cell 
          key={shortid.generate()} 
          row={row} 
          column={column} 
          demo={props.demo === true} 
          routePrefix="/physicals"
          cellType="Physical"
          item={physical}
          onCellDragStart={props.onCellDragStart}
          //onCellDragEnd={props.onCellDragEnd}
        />
      );
    }
  } 
  return (
    <>
      <div className="grid-container dropdown" style={gridContainerStyles}>
        { gridCells }  
      </div>
      {(props.dragging) ? ("dragging") : null}
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
      //title={`${props.type} ${props.column}, ${props.row} (Empty)`}
      onClick={props.selectCell}
      onDrop={props.onCellDrop}
      onDragOver={props.onCellDragOver}
      onDragEnd={props.onCellDragEnd}
      draggable={false}
  ></div>     
  );
}

function Cell(props) {
  let cellStyles = {
    'backgroundColor': props.cellType === "Container" ? props.item.bgColor : "rgb(0, 209, 253)",
    'borderColor': props.cellType === "Container" ? props.item.bgColor : "rgb(0, 209, 253)",
    'gridColumn': `${props.column} / span 1`,
    'gridRow': `${props.dragging ? props.row + 1 : props.row} / span 1`
  };
  let cellType = props.cellType;
  let routePrefix = cellType === "Container" ? "/containers" : "/physicals";
  return (
    <>
      {(props.demo === true) ? (
        <div
          key={shortid.generate()}
          style={cellStyles}
          className="grid-item"
          data-toggle="tooltip"
          data-placement="top"
          title={`${cellType} - ${props.item.name} ${props.column}, ${props.row}`}            
        ></div>
      ) : (
        <>
          {(cellType === "Physical") ? (
            <div
              key={shortid.generate()}
              id={props.item._id}
              to={`${routePrefix}/${props.item._id}`}
              style={cellStyles}
              row={props.row}
              col={props.column}
              className="grid-item"
              data-toggle="tooltip"
              data-placement="top"
              title={`${cellType} - ${props.item.name} ${props.column}, ${props.row}`} 
              draggable={true}
              onDragStart={props.onCellDragStart}
              //onDragEnd={props.onCellDragEnd}
            ></div>
          ) : (
            <Link
              key={shortid.generate()}
              id={props.item._id}
              to={`${routePrefix}/${props.item._id}`}
              style={cellStyles}
              row={props.row}
              col={props.column}
              className="grid-item"
              data-toggle="tooltip"
              data-placement="top"
              title={`${cellType} - ${props.item.name} ${props.column}, ${props.row}`} 
              draggable={true}
              onDragStart={props.onCellDragStart}
              //onDragEnd={props.onCellDragEnd}
            ></Link>
          )}
        </>
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
    // if (this.props.editMode === true) {
    //   console.log('edit mode');
    // }
  }

  componentWillUnmount() {
    window.$('[data-toggle="tooltip"]').tooltip('dispose');
  }

  render() {
    const newItemLocations = this.props.newItemLocations || [];
    const recordIconClasses = this.props.type === "Lab" ? "mdi mdi-teach mr-2" : "mdi mdi-grid mr-2";

    return (
      <div className="card rounded-0 mt-3 mb-3">
        <div className="card-header bg-dark text-light rounded-0">
          <div className="card-title mb-0 text-capitalize">
            {(this.props.isLoggedIn && this.props.demo) ? (
              <>
                <span>
                  <i className={recordIconClasses} />
                  {this.props.record.name || `(Select A ${this.props.type} Name)`}
                </span>  
              </>
            ) : (
              <>
                <span>
                  <i className={recordIconClasses} />
                  {this.props.record.name || (<>&nbsp;</>)}
                </span>
              </>
            )} 
            <GridToolbar 
                {...this.props}
                type={this.props.type}
                lab={this.props.lab}
                onRevokeLabMembership={this.props.onRevokeLabMembership}
                onRequestLabMembership={this.props.onRequestLabMembership}
                onCancelRequestLabMembership={this.props.onCancelRequestLabMembership}
                iconClasses={recordIconClasses}
            />   
          </div>
        </div>
        <div className="card-body" style={{'maxHeight': '70vh', 'overflow': 'scroll'}}>
          <GridContainer 
            selectCell={this.selectCell}
            containers={this.props.containers}
            physicals={this.props.physicals} 
            record={this.props.record} 
            newItemLocations={newItemLocations}
            {...this.props}/>       
        </div>
      </div>
    );
  }
}

export default Grid;
