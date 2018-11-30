import React from 'react';
import Search from './Search/Search';
import { ContainerFluid, Row, Column } from './Bootstrap/layout';
import { Button, ButtonGroup, Card, CardHeader, CardTitle, CardBody, CardText } from './Bootstrap/components';
import LabsJoined from './Lab/LabsJoined';
import LabsPending from './Lab/LabsPending';
import LabsToJoin from './Lab/LabsToJoin';

class Landing extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const isLoggedIn = this.props.isLoggedIn;
    const currentUser = this.props.currentUser;
   
    return (
      <ContainerFluid className="Landing">  
        <Row className="justify-content-lg-center">
          <div className="col-12 col-lg-7">
            {(isLoggedIn) ? (
              <Card className="mt-3 mb-3">
                <CardHeader dark className="bg-dark-green">
                  <CardTitle>Welcome Back {currentUser.username}</CardTitle>
                </CardHeader>
            
                <CardBody>
                  <img 
                    src={currentUser.gravatarUrl} 
                    className="user-img rounded d-block float-left" 
                    alt={`${currentUser.username}`}
                  />
                  <div className="d-block float-left ml-3">
                    <CardText>
                      You currently belong to {currentUser.labs.length} {currentUser.labs.length === 1 ? "Lab" : "Labs"}.
                    </CardText>  
                  </div>
                </CardBody>

                <LabsJoined {...this.props} />

                <LabsPending {...this.props} />        

                <LabsToJoin {...this.props} />                 
              
              </Card>
            ) : (
              <Card className="mt-3 mb-3 text-center text-lg-left">
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
            )}
          </div>
          <div className="col-12 col-lg-5">
            <Search {...this.props}/>
          </div>
        </Row>
      </ContainerFluid>
    );
  }
}

export default Landing;
