import React from 'react';
import Search from './Search/Search';
import { ContainerFluid, Row, Column } from './Bootstrap/layout';
import { Card, CardHeader, CardTitle, CardBody, CardText } from './Bootstrap/components';
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
        <Row>
          <Column col="12" colLg="7">
            {(isLoggedIn) ? (
              <Card className="mt-3 mb-3">
                <CardHeader>
                  <CardTitle>Welcome Back To BioNet {currentUser.username}</CardTitle>
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
              <Card className="mt-3 mb-3">
                <CardHeader dark>
                  <CardTitle>Welcome To BioNet</CardTitle>
                </CardHeader>
                <CardBody>
                  <CardText>Welcome To BioNet</CardText>
                </CardBody>
              </Card>
            )}
          </Column>
          <Column col="12" colLg="5">
            <Search {...this.state} {...this.props}/>
          </Column>
        </Row>
      </ContainerFluid>
    );
  }
}

export default Landing;
