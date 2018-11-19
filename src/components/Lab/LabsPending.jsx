import React from 'react';
import shortid from 'shortid';
import { CardHeader, CardTitle, CardList, CardListLink, CardBody, CardText } from '../Bootstrap/components';

class LabsPending extends React.Component {
  render() {
    const isLoggedIn = this.props.isLoggedIn;
    const currentUser = this.props.currentUser;
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
    return (
      <>
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
</>
    );
  }
}

export default LabsPending;