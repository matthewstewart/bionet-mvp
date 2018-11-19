import React from 'react';
import shortid from 'shortid';
import { CardHeader, CardTitle, CardList, CardListLink, CardBody, CardText } from '../Bootstrap/components';

class LabsToJoin extends React.Component {
  render() {
    const isLoggedIn = this.props.isLoggedIn;
    const currentUser = this.props.currentUser;
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
      <>
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
      </>
    );
  }
}

export default LabsToJoin;