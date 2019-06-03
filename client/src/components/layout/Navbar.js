import React, { Component } from "react";
import { Link } from "react-router-dom";
import { PropTypes } from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import { clearProfile } from "../../actions/profileActions";

class Navbar extends Component {
  onLogoutClick = e => {
    e.preventDefault();
    this.props.clearProfile();
    this.props.logoutUser();
  };

  render() {
    const { isAuthenticated, user } = this.props.auth;

    const authLinks = (
      <ul class="navbar-nav ml-auto">
        <li class="nav-item">
          <Link class="nav-link" to="/feed">
            Post Feed
          </Link>
        </li>
        <li class="nav-item">
          <Link class="nav-link" to="/dashboard">
            Dashboard
          </Link>
        </li>
        <li class="nav-item">
          <a href="#" onClick={this.onLogoutClick} className="nav-link">
            <img
              className="rounded-circle"
              src={user.avatar}
              alt={user.name}
              title="You must hava a gravatar connectd to your email"
              style={{ width: "25px", marginRight: "5px" }}
            />
            {"  "}
            Log out
          </a>
        </li>
      </ul>
    );

    const guestLinks = (
      <ul class="navbar-nav ml-auto">
        <li class="nav-item">
          <Link class="nav-link" to="/register">
            Sign Up
          </Link>
        </li>
        <li class="nav-item">
          <Link class="nav-link" to="/login">
            Login
          </Link>
        </li>
      </ul>
    );

    return (
      <nav class="navbar navbar-expand-sm navbar-dark bg-dark mb-4">
        <div class="container">
          <Link class="navbar-brand" to="/">
            DevConnector
          </Link>
          <button
            class="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#mobile-nav"
          >
            <span class="navbar-toggler-icon" />
          </button>

          <div class="collapse navbar-collapse" id="mobile-nav">
            <ul class="navbar-nav mr-auto">
              <li class="nav-item">
                <Link class="nav-link" to="/profiles">
                  {" "}
                  Developers
                </Link>
              </li>
            </ul>
            {isAuthenticated ? authLinks : guestLinks}
          </div>
        </div>
      </nav>
    );
  }
}

Navbar.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  clearProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { logoutUser, clearProfile }
)(Navbar);
