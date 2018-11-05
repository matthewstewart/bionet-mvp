import React, { Component } from 'react';
import Loader from './images/DNA_dblHelix.svg';
import "./Loading.css"

class Loading extends Component {
  render() { 
    return ( 
      <div className="Loading">
        {(!this.props.ready) ? (
          <div className="container-fluid">
            <div 
              className="loading-container row justify-content-center align-items-center"
              style={{'height': 'calc(100vh - 65px - 65px)'}}
            >      
              <div className="Loader">
                <img src={Loader} className="preLoader" alt="Loading" />
                <h3 className="loader-title text-light">Loading BioNet</h3>
              </div>
            </div>
          </div> 
        ) : (
          <div>
            {this.props.children}
          </div>
        )} 
      </div>   
    );
  }
}
 
export default Loading;