import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

class Footer extends Component {
  
  render() {
    
    return (
      <div className="Footer bg-dark-green text-light text-center">
        <Link to="/about">Learn more</Link> about the BioNet.
      </div>
    );

  }
}

export default Footer;
