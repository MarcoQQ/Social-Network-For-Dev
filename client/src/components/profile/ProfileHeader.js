import React, { Component } from "react";
import isEmpty from "../../validator/isEmpty";

class ProfileHeader extends Component {
  render() {
    const { profile } = this.props;
    return (
      <div ClassName="row">
        <div ClassName="col-md-12">
          <div ClassName="card card-body bg-info text-white mb-3">
            <div ClassName="row">
              <div ClassName="col-4 col-md-3 m-auto">
                <img
                  ClassName="rounded-circle"
                  src={profile.user.avatar}
                  alt=""
                />
              </div>
            </div>
            <div ClassName="text-center">
              <h1 ClassName="display-4 text-center">{profile.user.name}</h1>
              <p ClassName="lead text-center">
                {profile.status}{" "}
                {isEmpty(profile.company) ? null : (
                  <span>at {profile.company}</span>
                )}
              </p>

              {isEmpty(profile.location) ? null : <p>{profile.location}</p>}

              <p>
                <a ClassName="text-white p-2" href="#">
                  <i ClassName="fas fa-globe fa-2x" />
                </a>
                <a ClassName="text-white p-2" href="#">
                  <i ClassName="fab fa-twitter fa-2x" />
                </a>
                <a ClassName="text-white p-2" href="#">
                  <i ClassName="fab fa-facebook fa-2x" />
                </a>
                <a ClassName="text-white p-2" href="#">
                  <i ClassName="fab fa-linkedin fa-2x" />
                </a>
                <a ClassName="text-white p-2" href="#">
                  <i ClassName="fab fa-instagram fa-2x" />
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ProfileHeader;
