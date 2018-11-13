import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import shortid from 'shortid';

class Breadcrumbs extends Component {

  render() { 
    const path = this.props.path || [];
    const breadcrumbs = path.map((breadcrumb, index) => {
      if (index !== 0 && index !== path.length - 1){
        return (
          <li 
            key={shortid.generate()}
            className="breadcrumb-item"
          >
            <Link 
              className="breadcrumb-link text-info"
              to={index > 0 ? `/containers/${breadcrumb._id}` : `/labs/${breadcrumb._id}`}
              // onClick={() => { window.location.reload() }}
            >
              {breadcrumb.name}
            </Link>
          </li>  
        );
      } else { return null}
    });

    return ( 
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li 
            className="breadcrumb-item"
          >
            <Link 
              className="breadcrumb-link text-info"
              to={`/labs/${this.props.lab._id}`}
            >
              {this.props.lab.name}
            </Link>
          </li>          
          {breadcrumbs}
          <li className="breadcrumb-item active" aria-current="page">{this.props.item.name}</li>
        </ol>
      </nav>    
    );
  }
}
 
export default Breadcrumbs;