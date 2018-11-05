import React, { Timeout } from 'react';

class LazyLanding extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      users: []
    };
    this.fetchUrl = this.fetchUrl.bind(this);
  }

  // static getDerivedStateFromProps(props) {
  //   return { users: props.users };
  // }

  async fetchUrl(url) {
    try {
    // let postRequest = new Request(url, {
    //   method: 'POST',
    //   mode: 'cors',
    //   headers: new Headers({
    //     'Authorization': `Bearer ${Auth.getToken()}`
    //   });
    // })
    let res = await fetch(url);
    let response = res.json();
    return response;
    } catch (error) {
      throw error;
    }  
  }

  async getUsers() {
    try {
      let url = "https://bionet.me/api/v1/users";
      return await this.fetchUrl(url);
    } catch (error) {
      throw error;
    }  
  }

  async getData() {
    let users = await this.getUsers();
    return {
      users
    }
  }

  componentDidMount() {
    console.log('mounte')
    this.getData()
    .then((res) => {
      this.setState(res);
    })
    .catch((error) => {
      throw error;
    });
  }

  render() {
    return (
      <div className="User List">
        <pre>{JSON.stringify(this.state.users, null, 2)}</pre>
      </div>
    );
  }
}

export default LazyLanding;
