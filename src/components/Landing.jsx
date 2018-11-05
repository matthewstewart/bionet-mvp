import React from 'react';

class Landing extends React.Component {

  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    return (
      <div className="Landing">
        Is Logged In {this.props.isLoggedIn ? "true" : "false"}
      </div>
    );
  }
}

export default Landing;
