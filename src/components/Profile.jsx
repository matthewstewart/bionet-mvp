import React from 'react';
//import Auth from "../modules/Auth";
//import appConfig from '../configuration.js';

class Profile extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    //this.getData();
  }

  render() {
    const isLoggedIn = this.props.isLoggedIn;
    const currentUser = this.props.currentUser;
    const lab = this.props.lab;
    console.log('Profile.lab', lab);
    return (
      <div className="LabProfile container-fluid">
        
        <div className="row">
          <div className="col-12 col-lg-7 col-xl-8">

            <div className="card rounded-0">
              <div className="card-header rounded-0 bg-dark text-light">
                <div className="card-title mb-0 text-capitalize">
                  <span><i className="mdi mdi-teach" /> {lab ? lab.name : 'Profile'}</span>
                </div>
              </div>
                        
              <div className="card-body">
                  {}
                {/* {(this.state.error.length > 0) ? (
                  <p className="card-text text-danger">
                    {this.state.error}
                  </p>
                ) : null} */}
                
                {(lab.description && lab.description.length > 0) ? (
                  <p className="card-text">
                    {lab.description}
                  </p>
                ) : (
                  <p className="card-text">
                    No description provided.
                  </p>
                )}

              </div>   
            </div>

              {/* <Containers 
                labContainers={this.state.labContainers}
                labPhysicals={labAllPhysicals}
                containers={this.state.containers} 
                currentUser={this.props.currentUser}
                userIsMember={userIsMember}
                refresh={this.props.refresh}
                physicals={labChildPhysicals}                
              />  */}

              {/* <Physicals 
                labContainers={this.state.labContainers}
                labPhysicals={labAllPhysicals}
                containers={this.state.containers} 
                physicals={labChildPhysicals} 
                currentUser={this.props.currentUser}
                userIsMember={userIsMember}
                refresh={this.props.refresh}
              /> */}

          </div>

          {/* <div className="col-12 col-lg-5 col-xl-4">
            <Grid 
              {...this.props}
              demo={false}
              selectLocations={false}
              record={this.state.lab}
              containers={this.state.containers}
              physicals={labChildPhysicals}
              dragging={this.state.dragging}
              onCellDragStart={this.onCellDragStart}
              onCellDragOver={this.onCellDragOver}
              onCellDrop={this.onCellDrop}
              onCellDragEnd={this.onCellDragEnd}
              type="Lab"
              lab={this.state.lab}
              onRevokeLabMembership={this.onRevokeLabMembership}
              onRequestLabMembership={this.onRequestLabMembership}
              onCancelRequestLabMembership={this.onCancelRequestLabMembership}
            />
          </div> */}
        </div>
      </div>
    );
  }
}

export default Profile;
