import React from 'react';
import { Link } from 'react-router-dom';
import shortid from 'shortid';

class Landing extends React.Component {

  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    const isLoggedIn = this.props.isLoggedIn;
    const currentUser = this.props.currentUser;
    const labsJoined = isLoggedIn ? currentUser.labs.map((lab, index) => {
      return (
        <Link 
          key={shortid.generate()}
          className="list-group-item list-group-item-action bg-info text-light rounded-0"
          to={`/labs/${lab._id}`}
        >
          <i className="mdi mdi-teach mr-2"/>{lab.name}
        </Link>
      )
    }) : [];
    return (
      <div className="Landing container-fluid">
        
        <div className="row">
          <div className="col-12 col-lg-6">
            <div className="card rounded-0 mt-3">
              <div className="card-header rounded-0 bg-dark text-light">
                <h4 className="card-title mb-0 text-capitalize">{isLoggedIn ? `Welcome Back To BioNet ${currentUser.username}` : "Welcome To BioNet"}</h4>
              </div>
              {(isLoggedIn) ? (
                <>
                  <div className="card-body">
                    <img 
                      src={currentUser.gravatarUrl} 
                      className="user-img rounded d-block float-left" 
                      alt={`${currentUser.username}`}
                    />
                    <div className="d-block float-left ml-3">
                      <p className="card-text">
                        You Currently:<br/>
                        Belong to {currentUser.labs.length} Labs<br/>
                        Have Requested Access to {currentUser.labsRequested.length} Labs<br/>
                        Have {currentUser.labsToJoin.length} Labs Yet To Join
                      </p>  
                    </div>
                  </div>
                  <ul className="list-group list-group-flush">
                    {labsJoined}
                    <Link
                      to="/labs/new"
                      className="list-group-item list-group-item-action bg-success text-light rounded-0"
                    >
                      <i className="mdi mdi-plus mr-2"/>Create New Lab
                    </Link>
                  </ul>
                </>
              ) : (
                <div className="card-body">
                  <p className="card-text">Welcome To BioNet</p>
                </div>
              )}   
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Landing;
