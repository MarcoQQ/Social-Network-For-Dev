const Validator = require("validator");

const isEmpty = require("./is-empty");

module.exports = function validateProfileInput(data) {
  let errors = {};

  data.handle = isEmpty(data.handle) ? "" : data.handle;
  data.status = isEmpty(data.status) ? "" : data.status;
  data.bio = isEmpty(data.bio) ? "" : data.bio;
  data.skills = isEmpty(data.skills) ? "" : data.skills;

  if (!Validator.isLength(data.handle, { min: 2, max: 40 })) {
    errors.handle = "handle needs to be between 2 and 40 characters";
  }

  if (Validator.isEmpty(data.handle)) {
    errors.handle = "handle is required";
  }

  if (Validator.isEmpty(data.status)) {
    errors.status = "status is required";
  }

  if (Validator.isEmpty(data.skills)) {
    errors.skills = "skills is required";
  }

  if (Validator.isEmpty(data.bio)) {
    errors.bio = "bio is required";
  }

  if (!isEmpty(data.website)) {
    if (!Validator.isURL(data.website)) {
      errors.website = "not a valid url";
    }
  }

  if (!isEmpty(data.twitter)) {
    if (!Validator.isURL(data.twitter)) {
      errors.twitter = "not a valid url";
    }
  }

  if (!isEmpty(data.facebook)) {
    if (!Validator.isURL(data.facebook)) {
      errors.facebook = "not a valid url";
    }
  }

  if (!isEmpty(data.linkedin)) {
    if (!Validator.isURL(data.linkedin)) {
      errors.linkedin = "not a valid url";
    }
  }

  if (!isEmpty(data.instagram)) {
    if (!Validator.isURL(data.instagram)) {
      errors.instagram = "not a valid url";
    }
  }

  if (!isEmpty(data.youtube)) {
    if (!Validator.isURL(data.youtube)) {
      errors.youtube = "not a valid url";
    }
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
