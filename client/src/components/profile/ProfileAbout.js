import React, { Component } from "react";
import PropTypes from "prop-types";

class ProfileAbout extends Component {
  render() {
    const { profile } = this.props;

    //firstName
    const firstName = profile.user.name.trim().split(" ")[0];

    //skills
    const skills = profile.skills.map((skill, index) => (
      <div key={index} className="p-3">
        <i className="fa fa-check" />
        {skill}
      </div>
    ));
    console.log(skills);

    return (
      <div className="row">
        <div className="col-md-12">
          <div className="card card-body bg-light mb-3">
            <h3 className="text-center text-info">{firstName}'s Bio</h3>
            <p className="lead">{profile.bio}</p>
            <hr />
            <h3 className="text-center text-info">Skill Set</h3>
            <div className="row">
              <div className="d-flex flex-wrap justify-content-center align-items-center">
                {skills}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ProfileAbout.propTypes = {
  profile: PropTypes.object.isRequired
};

export default ProfileAbout;
