import React from 'react';
import { ContainerFluid, Row, Column } from './Bootstrap/layout';
import { Button, ButtonGroup, Card, CardHeader, CardTitle, CardBody, CardText } from './Bootstrap/components';

class About extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
   
    return (
      <ContainerFluid className="Landing">  
        <Row className="justify-content-lg-center">
          <Column col="12" colLg="7">
            <Card className="mb-3 text-center">
              <CardHeader dark className="bg-dark-green">
                <CardTitle>BioNet</CardTitle>
              </CardHeader>
              <CardBody>
                <CardTitle className="mb-2"><strong>Open Source Biological Inventory Management</strong></CardTitle>
                <CardText>Welcome to BioNet. Keep track of your stuff, find what you need, and share as you like. The BioNet supports searching for biological material across multiple labs — all your inventory information is controlled locally by you. You decide if others can see what you wish to share. All BioNet software and associated materials are open source and free to use.</CardText>
                <Column className="text-center">
                  <ButtonGroup className="mb-3">
                    <Button type="success" link to="/login">Login</Button>
                    <Button type="primary" link to="/signup">Sign Up</Button>
                  </ButtonGroup>
                </Column>
              </CardBody>
            </Card>
          </Column>
        </Row>
      </ContainerFluid>
    );
  }
}

export default About;
