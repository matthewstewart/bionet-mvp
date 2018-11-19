import React, { Component } from 'react';
import  { Link } from 'react-router-dom';

export const Form = class Form extends Component {
  render() {
    let classes = "form";
    if (this.props.className) { classes += ` ${this.props.className}` }
    return (
      <form className={classes} onSubmit={this.props.onSubmit}>
        {this.props.children}
      </form>
    );
  }
}

export const TextArea = class TextArea extends Component {
  render() {
    let classes = "form-group";
    if (this.props.className) { classes += ` ${this.props.className}` }
    return (
      <div className={classes}>
        <label htmlFor={this.props.name}>{this.props.label}</label>
        <textarea 
          type="textarea" 
          name={this.props.name}
          placeholder={this.props.placeholder}
          rows={this.props.rows || 3}
          className="form-control" 
          value={this.props.value}
          onChange={this.props.onChange} 
        ></textarea>
      </div>
    );
  }
}

export const TextInput = class TextInput extends Component {
  render() {
    let classes = "form-group";
    if (this.props.className) { classes += ` ${this.props.className}` }
    let instructions = this.props.instructions ? ( <small className="form-text text-muted">{this.props.instructions}</small> ) : null;
    let error = this.props.error ? ( <small className="form-text text-danger">{this.props.error}</small> ) : null;
    return (
      <div className={classes}>
        <label htmlFor={this.props.name}>{this.props.label}</label>
        <input 
          type="text" 
          name={this.props.name}
          className="form-control"
          placeholder={this.props.placeholder}
          value={this.props.value}
          onChange={this.props.onChange} 
        />
        {instructions}
        {error}
      </div>
    );
  }
}

export const NumberInput = class NumberInput extends Component {
  render() {
    let classes = "form-group";
    if (this.props.className) { classes += ` ${this.props.className}` }
    return (
      <div className={classes}>
        <label htmlFor={this.props.name}>{this.props.label}</label>
        <input 
          type="number"
          name={this.props.name}
          min={this.props.min}
          max={this.props.max}
          step={this.props.step} 
          className="form-control" 
          value={this.props.value}
          onChange={this.props.onChange} 
        />
      </div>
    );
  }
}

export const ColorInput = class ColorInput extends Component {
  render() {
    let classes = "form-group";
    if (this.props.className) { classes += ` ${this.props.className}` }
    return (
      <div className={classes}>
        <label htmlFor={this.props.name}>{this.props.label}</label>
        <input 
          type="color" 
          name={this.props.name}
          className="form-control" 
          value={this.props.value || "#FF0000"}
          onChange={this.props.onChange} 
        />
      </div>
    );
  }
}

export const SubmitGroup = class SubmitGroup extends Component {
  render() {
    let classes = "form-group text-center";
    if (this.props.className) { classes += ` ${this.props.className}` }
    return (
      <div className={classes}>
        <div className="btn-group">
          <Link className="btn btn-secondary" to={this.props.cancelTo} >Cancel</Link>
          <button className="btn btn-success">Submit</button>
        </div>
      </div>
    );
  }
}