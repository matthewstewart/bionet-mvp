import React from 'react';
import Search from './Search/Search';
import { ContainerFluid, Row, Column } from './Bootstrap/layout';

class Landing extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
   
    return (
      <ContainerFluid className="Landing">  
        <Row className="justify-content-lg-center">
          <Column col="12" colLg="7" colXl="5">
            <Search {...this.props}/>
          </Column>
        </Row>
      </ContainerFluid>
    );
  }
}

export default Landing;
