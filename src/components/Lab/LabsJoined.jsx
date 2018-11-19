import React from 'react';
import shortid from 'shortid';
import { CardHeader, CardTitle, CardList, CardListLink } from '../Bootstrap/components';

class LabsJoined extends React.Component {
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
    return (
      <>
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
      </>
    );
  }
}

export default LabsJoined;