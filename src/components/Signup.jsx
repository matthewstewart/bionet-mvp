import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import appConfig from '../configuration.js';

class Signup extends Component {

  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
      user: {
        username: "",
        password: "",
        passwordConfirm: "",
        email: "",
        name: ""
      },
      errors: {},
    };
    this.changeUser = this.changeUser.bind(this);
    this.processForm = this.processForm.bind(this);
  }

  changeUser(e) {
    const field = e.target.getAttribute('name');
    let user = this.state.user;
    user[field] = e.target.value;
    this.setState({
      user
    });    
  }

  processForm(e) {
    e.preventDefault();
    const username = encodeURIComponent(this.state.user.username);
    const name = encodeURIComponent(this.state.user.name);
    const email = encodeURIComponent(this.state.user.email);
    const password = encodeURIComponent(this.state.user.password);
    const formData = `username=${username}&password=${password}&name=${name}&email=${email}`;
    const xhr = new XMLHttpRequest();
    xhr.open('post', `${appConfig.apiBaseUrl}/signup`);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      console.log(xhr.status)
      if(xhr.status === 200){
        localStorage.setItem('successMessage', xhr.response.message);
        this.setState({
          errors: {},
          redirect: true
        });
      } else {
        const errors = xhr.response.errors ? xhr.response.errors : {};
        errors.summary = xhr.response.message;
        this.setState({
          errors
        });
      }
    });
    xhr.send(formData);
  }

  render() {
    if(this.state.redirect){ return( <Redirect to="/login" /> ) }
    return (
      <div className="container-fluid">
        
        <div className="row">
          <div className="col col-md-7 col-lg-5 ml-md-auto mr-md-auto text-center">
            <div className="card rounded-0 mt-3">
              <div className="card-header bg-dark text-light rounded-0">
                <h4 className="card-title mb-0">Sign Up</h4>
              </div>
              <div className="card-body">
                <p className="card-text">
                  Please fill out the fields below to register for a new account.
                </p>
                <form onSubmit={ this.processForm }>
                  {this.state.errors.summary && <div className="alert alert-danger">{ this.state.errors.summary }</div>}
                  <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input 
                      type="text"
                      className="form-control"
                      name="name"
                      placeholder="Your Full Name"
                      value={this.state.user.name}
                      onChange={this.changeUser}
                    />
                    {this.state.errors.name && <small className="text-danger">{this.state.errors.name}</small>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="name">Email</label>
                    <input 
                      type="text"
                      className="form-control"
                      name="email"
                      placeholder="youremailaddress@example.com"
                      value={this.state.user.email}
                      onChange={this.changeUser}
                    />
                    {this.state.errors.email && <small className="text-danger">{this.state.errors.email}</small>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input 
                      type="text"
                      className="form-control"
                      name="username"
                      placeholder="username"
                      value={this.state.user.username}
                      onChange={this.changeUser}
                    />
                    {this.state.errors.username && <small className="text-danger">{this.state.errors.username}</small>}
                  </div>
                  <div className="form-group">  
                    <label htmlFor="password">Password</label>
                    <input 
                      type="password"
                      className="form-control"
                      name="password"
                      placeholder="password"
                      value={this.state.user.password}
                      onChange={this.changeUser}                      
                    />
                    {this.state.errors.password && <small className="text-danger">{this.state.errors.password}</small>}
                  </div>
                  <div className="form-group">  
                    <label htmlFor="passwordConfirm">Confirm Password</label>
                    <input 
                      type="password"
                      className="form-control"
                      name="passwordConfirm"
                      placeholder="confirm password"
                      value={this.state.user.passwordConfirm}
                      onChange={this.changeUser}                      
                    />
                    { ( this.state.user.password.length > 0 && this.state.user.passwordConfirm.length > 0) ? (
                        <div>
                          { (this.state.user.password === this.state.user.passwordConfirm) ? (
                            <small className="text-success">Password Match</small>
                          ) : (
                            <small className="text-danger">Password Does Not Match</small>
                          )}                          
                        </div>  
                      ) : null }
                  </div>
                  {(
                    this.state.user.name.length > 0 && 
                    this.state.user.email.length > 0 && 
                    this.state.user.username.length > 0 && 
                    this.state.user.password.length > 0 &&
                    this.state.user.passwordConfirm.length > 0 &&
                    this.state.user.password === this.state.user.passwordConfirm
                  ) ? (
                    <div className="form-group text-center">
                      <button type="submit" className="btn btn-success mt-3">Submit</button>
                    </div>
                  ) : null} 

                </form>
              </div>
            </div>
          </div>
        </div>

      </div>
    );
  }
}

export default Signup;