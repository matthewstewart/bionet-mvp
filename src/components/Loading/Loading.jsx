import React, { Component } from 'react';
import Loader from './images/DNA_dblHelix.svg';
import "./Loading.css"

class Loading extends Component {
  render() { 
    return ( 
      <div className="Loading">
        <div className="container-fluid">
          <div className="loading-container row justify-content-center align-items-center">      
            <div className="Loader">
              <img src={Loader} className="preLoader" alt="Loading" />
              <h3 className="loader-title">Loading BioNet</h3>
            </div>
          </div>
        </div> 
      </div>   
    );
  }
}
 
export default Loading;