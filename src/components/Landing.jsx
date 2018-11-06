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
    const labsRequested = isLoggedIn ? currentUser.labsRequested.map((lab, index) => {
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
    const labsToJoin = isLoggedIn ? currentUser.labsToJoin.map((lab, index) => {
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
            {(isLoggedIn) ? (
              <div className="card rounded-0 mt-3 mb-3">
                <div className="card-header rounded-0 bg-dark text-light">
                  <h4 className="card-title mb-0 text-capitalize">Welcome Back To BioNet {currentUser.username}</h4>
                </div>
            
                  
                <div className="card-body">
                  <img 
                    src={currentUser.gravatarUrl} 
                    className="user-img rounded d-block float-left" 
                    alt={`${currentUser.username}`}
                  />
                  <div className="d-block float-left ml-3">
                    <p className="card-text">
                      You currently belong to {currentUser.labs.length} {currentUser.labs.length === 1 ? "Lab" : "Labs"}.
                    </p>  
                  </div>
                </div>

                <div className="card-header rounded-0 bg-dark text-light">
                  <h5 className="card-title mb-0 text-capitalize">Your {currentUser.labs.length === 1 ? "Lab" : "Labs"} ({currentUser.labs.length})</h5>
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

                <div className="card-header rounded-0 bg-dark text-light">
                  <h5 className="card-title mb-0 text-capitalize">Pending Lab {currentUser.labsRequested.length === 1 ? "Request" : "Requests"} ({currentUser.labsRequested.length})</h5>
                </div>
                {(currentUser.labsRequested.length > 0) ? (
                  <ul className="list-group list-group-flush">
                    {labsRequested}
                  </ul>
                ) : (
                  <div className="card-body">
                    <p className="card-text">
                      You currently have no pending lab membership requests. Try requesting membership from one of the labs listed below.
                    </p>
                  </div>
                )}          


                <div className="card-header rounded-0 bg-dark text-light">
                  <h5 className="card-title mb-0 text-capitalize">Other Labs ({labsToJoin.length})</h5>
                </div>
                {(labsToJoin.length > 0) ? (
                  <ul className="list-group list-group-flush">
                    {labsToJoin}
                  </ul>
                ) : (
                  <div className="card-body">
                    <p className="card-text">
                      There are currently no other labs listed to join.
                    </p>
                  </div>
                )}                  
              
              </div>
            ) : (
              <div className="card rounded-0 mt-3 mb-3">
                <div className="card-header rounded-0 bg-dark text-light">
                  <h4 className="card-title mb-0 text-capitalize">Welcome To BioNet</h4>
                </div>
                <div className="card-body">
                  <p className="card-text">Welcome To BioNet</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Landing;
