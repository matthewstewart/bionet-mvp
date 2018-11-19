import React, { Component } from 'react';
import { Link, NavLink } from 'react-router-dom';

export const BootstrapBoundary = class BootstrapBoundary extends Component {
  
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: {} };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // You can also log the error to an error reporting service
    // logErrorToMyService(error, info);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong. {this.state.error}</h1>;
    }

    return this.props.children;
  }
}

export const Alert = class Alert extends Component {
  render() {
    let classes = "alert";
    if (this.props.type) { 
      classes += ` alert-${this.props.type}` 
    } else {
      classes += ' alert-info';
    }
    if (this.props.dismissible) {
      classes += ' alert-dismissible fade show';
    }
    if (this.props.className) { classes += ` ${this.props.className}` }
    return (
      <div className={classes} role="alert">
        <strong>{this.props.status}</strong> {this.props.message}
        {(this.props.dismissible) ? (
          <button type="button" className="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden={true}>&times;</span>
          </button>
        ) : null }
      </div>
    );
  }
}

export const Badge = class Badge extends Component {
  render() {
    let classes = "badge";
    if (this.props.pill) { classes += ' badge-pill'} 
    if (this.props.type) { 
      classes += ` badge-${this.props.type}` 
    } else {
      classes += ' badge-info';
    }
    if (this.props.className) { classes += ` ${this.props.className}` }
    if (this.props.link) {
      return (
        <Link 
          className={classes}
          to={this.props.linkTo}
        >
          {this.props.children}
        </Link>
      );
    } else {
      return (
        <span className={classes}>
          {this.props.children}
        </span>
      );
    }
  }
}

export const Breadcrumb = class Breadcrumb extends Component {
  render() {
    let classes = "breadcrumb";
    if (this.props.className) { classes += ` ${this.props.className}` }
    const breadcrumbs = this.props.path.map((breadcrumb, index) => {
      if (index === 0) {
        return (
          <li className="breadcrumb-item">
            <Link to={`/labs/${breadcrumb._id}`}>{breadcrumb.name}</Link>
          </li>
        );
      } else {
        return ( 
          <li className="breadcrumb-item">
            <Link to={`/containers/${breadcrumb._id}`}>{breadcrumb.name}</Link>
          </li>
        );
      }
    });
    return (
      <nav 
        aria-label="breadcrumb"
        className={classes}
      >
        <ol className="breadcrumb">
          {breadcrumbs}
          <li className="breadcrumb-item active" aria-current="page">Current Item</li>
        </ol>
      </nav>
    );
  }
}

export const Button = class Button extends Component {
  render() {
    let classes = "btn";
    if (this.props.type) { 
      if (this.props.outline) {
        classes += ` btn-outline-${this.props.type}`;
      } else {
        classes += ` btn-${this.props.type}`;
      }
    }
    if (this.props.className) { classes += ` ${this.props.className}` }
    if (this.props.link) {
      return (
        <Link
          to={this.props.to}
          className={classes}
        >
          {this.props.children}
        </Link>
      );
    } else {
      return (
        <button
          className={classes}
        >
          {this.props.children}
        </button>
      );
    }
  }
}

export const ButtonGroup = class ButtonGroup extends Component {
  render() {
    let classes = "btn-group";
    if (this.props.className) { classes += ` ${this.props.className}` }
    return (
      <div
        className={classes}
        role="group"
        aria-label={this.props.label}
      >
        {this.props.children}
      </div>
    );
  }
}

export const Card = class Card extends Component {
  render() {
    let classes = "card rounded-0";
    if (this.props.dark) { classes += ` border border-secondary` }
    if (this.props.className) { classes += ` ${this.props.className}` }
    return (
      <div
        className={classes}
      >
        {this.props.children}
      </div>
    );
  }
}

export const CardHeader = class CardHeader extends Component {
  render() {
    let classes = "card-header rounded-0";
    if (this.props.dark) { classes += ` bg-dark text-light` }
    if (this.props.className) { classes += ` ${this.props.className}` }
    return (
      <div
        className={classes}
      >
        {this.props.children}
      </div>
    );
  }
}

export const CardTitle = class CardTitle extends Component {
  render() {
    let classes = "card-title mb-0 text-capitalize";
    if (this.props.className) { classes += ` ${this.props.className}` }
    if (this.props.small) {
      return (
        <h5
          className={classes}
        >
          {this.props.children}
        </h5>
      );
    } else {
      return (
        <h4
          className={classes}
        >
          {this.props.children}
        </h4>
      );
    }
  }
}

export const CardBody = class CardBody extends Component {
  render() {
    let classes = "card-body";
    if (this.props.className) { classes += ` ${this.props.className}` }
    return (
      <div
        className={classes}
      >
        {this.props.children}
      </div>
    );
  }
}

export const CardText = class CardText extends Component {
  render() {
    let classes = "card-text";
    if (this.props.className) { classes += ` ${this.props.className}` }
    return (
      <p
        className={classes}
      >
        {this.props.children}
      </p>
    );
  }
}

export const CardList = class CardList extends Component {
  render() {
    let classes = "list-group list-group-flush";
    if (this.props.className) { classes += ` ${this.props.className}` }
    return (
      <ul
        className={classes}
      >
        {this.props.children}
      </ul>
    );
  }
}

export const CardListLink = class CardListLink extends Component {
  render() {
    let classes = "list-group-item list-group-item-action rounded-0";
    if (this.props.dark) { classes += ' text-light' }
    if (this.props.type) { classes += ` bg-${this.props.type}` }
    if (this.props.className) { classes += ` ${this.props.className}` }
    return (
      <Link
        className={classes}
        to={this.props.to}
      >
        {this.props.children}
      </Link>
    );
  }
}

export const Navbar = class Navbar extends Component {
  render() {
    let classes = "navbar navbar-expand-lg";
    if (this.props.type) {
      this.props.dark ? classes += ' navbar-dark' : classes += ' navbar-light';
      classes += ` bg-${this.props.type}`;
    } else {
      classes += ' navbar-light bg-light'
    }
    if (this.props.className) { classes += ` ${this.props.className}` }
    return (
      <nav className={classes}>
        {this.props.children}
      </nav>
    );
  }
}

export const NavbarBrand = class NavbarBrand extends Component {
  render() {
    let classes = "navbar-brand";
    if (this.props.className) { classes += ` ${this.props.className}` }
    return (
      <Link className={classes} to={this.props.to || '/'}>
        {(this.props.imgSrc) ? (
          <>
            <img 
              src={this.props.imgSrc} 
              width={this.props.width || "30"} 
              height="30" 
              alt={this.props.imgAlt}
              className="mr-3"
            />
            {this.props.children}
          </>
        ) : (
          <>
            {this.props.children}
          </>
        )}
      </Link>
    );
  }
}

export const NavbarNav = class NavbarNav extends Component {
  render() {
    let classes = "collapse navbar-collapse";
    if (this.props.className) { classes += ` ${this.props.className}` }
    return (
      <>
        <button 
          className="navbar-toggler" 
          type="button" 
          data-toggle="collapse"
          data-target="#navbarNav" 
          aria-controls="navbarNav" 
          aria-expanded="false" 
          aria-label="Toggle Navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={classes} id="navbarNav">
          <ul className="navbar-nav ml-auto">
            {this.props.children}
          </ul>
        </div>
      </>
    );
  }      
}

export const NavbarLink = class NavbarLink extends Component {
  render() {
    let liClasses = "nav-item";
    let linkClasses = "nav-link";
    if (this.props.active) { liClasses += ' active' }
    if (this.props.disabled) { linkClasses += ' disabled' }
    if (this.props.className) { liClasses += ` ${this.props.className}` }
    return (
      <li className={liClasses}>
        <NavLink to={this.props.to} className={linkClasses}>
          {this.props.children}
        </NavLink>
      </li>
    );
  }      
}

export const NavbarDropdown = class NavbarDropdown extends Component {
  render() {
    let classes = "nav-item dropdown";
    if (this.props.className) { classes += ` ${this.props.className}` }
    return (
      <li className={classes}>
        <a 
          className="nav-link dropdown-toggle" 
          href="/"
          id={this.props.id}
          role="button"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >{this.props.label}</a>
        <div 
          className="dropdown-menu"
          aria-labelledby={this.props.id}
        >
          {this.props.children}
        </div>
      </li>
    );
  }      
}

export const NavbarDropdownLink = class NavbarDropdownLink extends Component {
  render() {
    let classes = "dropdown-item";
    if (this.props.className) { classes += ` ${this.props.className}` }
    return (
      <NavLink to={this.props.to} className={classes}>
        {this.props.children}
      </NavLink>
    );
  }      
}

export const NavTabs = class NavTabs extends Component {
  render() {
    let classes = "nav nav-tabs";
    if (this.props.className) { classes += ` ${this.props.className}` }
    return (
      <ul className={classes}>
        {this.props.children}
      </ul>
    );    
  }
}
