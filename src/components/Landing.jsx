import React from 'react';
import shortid from 'shortid';
import Search from './Search/Search';
import { ContainerFluid, Row, Column } from './Bootstrap/layout';
import { Card, CardHeader, CardTitle, CardBody, CardText, CardList, CardListLink } from './Bootstrap/components';

class Landing extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const isLoggedIn = this.props.isLoggedIn;
    const currentUser = this.props.currentUser;
    const labsJoined = isLoggedIn ? currentUser.labs.map((lab, index) => {
      return (
        <CardListLink 
          key={shortid.generate()}
          dark
          type="info"
          to={`/labs/${lab._id}`}
        >
          <i className="mdi mdi-teach mr-2"/>{lab.name}
        </CardListLink>
      )
    }) : [];
    const labsRequested = isLoggedIn ? currentUser.labsRequested.map((lab, index) => {
      return (
        <CardListLink 
          key={shortid.generate()}
          dark
          type="info"
          to={`/labs/${lab._id}`}
        >
          <i className="mdi mdi-teach mr-2"/>{lab.name}
        </CardListLink>
      )
    }) : []; 
    const labsToJoin = isLoggedIn ? currentUser.labsToJoin.map((lab, index) => {
      return (
        <CardListLink 
          key={shortid.generate()}
          dark
          type="info"
          to={`/labs/${lab._id}`}
        >
          <i className="mdi mdi-teach mr-2"/>{lab.name}
        </CardListLink>
      )
    }) : [];    
    return (
      <ContainerFluid className="Landing">  
        <Row>
          <Column col="12" colLg="7">
            {(isLoggedIn) ? (
              <Card className="mt-3 mb-3">
                <CardHeader dark>
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

                <CardHeader dark>
                  <CardTitle small>
                    Your {currentUser.labs.length === 1 ? "Lab" : "Labs"} ({currentUser.labs.length})
                  </CardTitle>
                </CardHeader>                 
                <CardList>
                  {labsJoined}
                  <CardListLink
                    to="/labs/new"
                    dark
                    type="success"
                  >
                    <i className="mdi mdi-plus mr-2"/>Create New Lab
                  </CardListLink>
                </CardList>

                <CardHeader dark>
                  <CardTitle small>
                    Pending Lab {currentUser.labsRequested.length === 1 ? "Request" : "Requests"} ({currentUser.labsRequested.length})
                  </CardTitle>
                </CardHeader>
                {(currentUser.labsRequested.length > 0) ? (
                  <CardList>
                    {labsRequested}
                  </CardList>
                ) : (
                  <CardBody>
                    <CardText>
                      You currently have no pending lab membership requests. Try requesting membership from one of the labs listed below.
                    </CardText>
                  </CardBody>
                )}          


                <CardHeader dark>
                  <CardTitle small>Other Labs ({labsToJoin.length})</CardTitle>
                </CardHeader>
                {(labsToJoin.length > 0) ? (
                  <CardList>
                    {labsToJoin}
                  </CardList>
                ) : (
                  <CardBody>
                    <CardText>
                      There are currently no other labs listed to join.
                    </CardText>
                  </CardBody>
                )}                  
              
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
