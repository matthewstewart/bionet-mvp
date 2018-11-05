import React, { Component } from 'react';
import './Footer.css';

class Footer extends Component {
  
  render() {
    
    return (
      <div className="Footer bg-black text-light text-center">
        <a href="https://bionet.io/">The BioNet</a> is a project of <a href="https://biobricks.org/">The BioBricks Foundation.</a>
      </div>
    );

  }
}

export default Footer;
