import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { getCurrentProfile, deleteAccount } from "../../actions/profileActions";
import { ProfileActions } from "./ProfileActions";
import Experience from "./Experience";
import Education from "./Education";

class Dashboard extends Component {
  componentDidMount() {
    this.props.getCurrentProfile();
  }

  onDeleteClick = () => {
    this.props.deleteAccount();
  };

  render() {
    const { user } = this.props.auth;
    const { profile, loading } = this.props.profile;

    let dashboardContent;

    //first time render or    loading
    if (profile === null || loading) {
      dashboardContent = <h4>loading</h4>;
    } else {
      //check if login user has profile user
      if (Object.keys(profile).length > 0) {
        //display
        dashboardContent = (
          <div>
            <p className="lead text-muted">
              <Link to={`/profile/${profile.handle}`}>{user.name}</Link>
            </p>
            <ProfileActions />
            <Experience experience={profile.experience} />
            <Education education={profile.education} />
            {/* TODO: exp and edu */}
            <div style={{ marginBottom: "60px" }} />
            <button onClick={this.onDeleteClick} className="btn btn-danger">
              Delete My Account
            </button>
          </div>
        );
      } else {
        //logged in  but has no profile
        dashboardContent = (
          <div>
            <p className="lead text-muted">{user.name}</p>
            <p>you have not yet set up profile</p>
            <Link to="/create-profile" className="btn btn-lg btn-info">
              create profile
            </Link>
          </div>
        );
      }
    }

    return (
      <div className="dashboard">
        <div className="container">
          <div className="row">
            <div className="col-md-5">
              <h1 className="display-4">Dashboard</h1>
              {dashboardContent}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  deleteAccount: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { getCurrentProfile, deleteAccount }
)(Dashboard);
