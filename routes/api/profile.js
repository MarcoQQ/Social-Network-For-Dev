const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");

const router = express.Router();

//load profile modules
const Profile = require("../../models/Profile");
const User = require("../../models/User");
const validateProfileInput = require("../../validator/profile");
const validateExperienceInput = require("../../validator/experience");
const validateEducationInput = require("../../validator/education");

// @route     GET api/profile/test
// @desc      Tests profile route
// @access    Public
router.get("/test", (req, res) => {
  res.json({ msg: "profile works" });
});

// @route     GET api/profile/
// @desc      GET CURRENT USER PROFILE
// @access    Private
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};

    Profile.findOne({ user: req.user.id })
      .populate("user", ["name", "avatar"])
      .then(profile => {
        if (!profile) {
          errors.noprofile = "There is no profile for this user";
          return res.status(404).json(errors);
        }

        res.json(profile);
      })
      .catch(err => res.status(404).json(err));
  }
);

// @route     GET api/profile/all
// @desc      GET all profiles
// @access    Public
router.get("/all", (req, res) => {
  const errors = {};
  Profile.find()
    .populate("user", ["name", "avatar"])
    .then(profiles => {
      // console.log(1);
      if (!profiles) {
        errors = "There are no profiles";
        res.status(404).json(errors);
      }
      res.json(profiles);
    })
    .catch(err => res.status(404).json({ noprofile: "There are no profiles" }));
  // console.log(2);
});

// @route     GET api/profile/handle/:handle
// @desc      GET profile by handle
// @access    Public
router.get("/handle/:handle", (req, res) => {
  const errors = {};
  Profile.findOne({ handle: req.params.handle })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.noprofile = "there is no profile for this handle";
        res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err => res.status(404).json(err));
});

// @route     GET api/profile/user/:user_id
// @desc      GET profile by user_id
// @access    Public
router.get("/user/:user_id", (req, res) => {
  const errors = {};
  Profile.findOne({ user: req.params.user_id })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.noprofile = "there is no profile for this user_id";
        res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err =>
      res.status(404).json({ noprofile: "There is no profile for this user" })
    );
});

// @route     POST api/profile/
// @desc      CREATE or UPDATE USER PROFILE
// @access    Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateProfileInput(req.body);
    if (!isValid) {
      //return any errors with 400 code
      return res.status(400).json(errors);
    }

    //get field
    const profileField = {};
    profileField.user = req.user.id;
    profileField.handle = req.body.handle;
    profileField.company = req.body.company;
    profileField.website = req.body.website;
    profileField.location = req.body.location;
    profileField.bio = req.body.bio;
    profileField.status = req.body.status;

    profileField.githubusername = req.body.githubusername;

    //skills  split into an array
    if (typeof req.body.skills !== "undefined") {
      profileField.skills = req.body.skills.split(",");
    }

    //social
    profileField.social = {};
    profileField.social.youtube = req.body.youtube;
    profileField.social.twitter = req.body.twitter;
    profileField.social.linkedin = req.body.linkedin;
    profileField.social.facebook = req.body.facebook;
    profileField.social.instagram = req.body.instagram;

    Profile.findOne({ user: req.user.id })
      .then(profile => {
        if (profile) {
          //update
          Profile.findOneAndUpdate(
            { user: req.user.id },
            { $set: profileField },
            //return new data
            { new: true }
          ).then(profile => {
            res.json(profile);
          });
        } else {
          //add
          //check if handle exists
          Profile.findOne({ handle: profileField.handle }).then(profile => {
            if (profile) {
              errors.handle = "that handle already exists";
              res.status(400).json(errors);
            } else {
              //save profile
              new Profile(profileField).save().then(profile => {
                res.json(profile);
              });
            }
          });
        }
      })
      .catch(err => {});
  }
);

// @route     POST api/profile/experience
// @desc      add profile experience
// @access    Private
router.post(
  "/experience",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateExperienceInput(req.body);
    if (!isValid) {
      //return any errors with 400 code
      return res.status(400).json(errors);
    }

    Profile.findOne({ user: req.user.id }).then(profile => {
      if (profile) {
        const newExp = {
          title: req.body.title,
          company: req.body.company,
          location: req.body.location,
          from: req.body.from,
          to: req.body.to,
          current: req.body.current,
          description: req.body.description
        };

        profile.experience.unshift(newExp);

        profile.save().then(profile => res.json(profile));
      } else {
        return res.status(400).json({});
      }
    });
  }
);

// @route     POST api/profile/education
// @desc      add profile education
// @access    Private
router.post(
  "/education",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateEducationInput(req.body);
    if (!isValid) {
      //return any errors with 400 code
      return res.status(400).json(errors);
    }

    Profile.findOne({ user: req.user.id }).then(profile => {
      const newEdu = {
        school: req.body.school,
        degree: req.body.degree,
        fieldofstudy: req.body.fieldofstudy,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      };

      profile.education.unshift(newEdu);

      profile.save().then(profile => res.json(profile));
    });
  }
);

// @route     DELETE api/profile/experience/:exp_id
// @desc      delete exp from profile
// @access    Private
router.delete(
  "/experience/:exp_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        //find the experience
        const removeIndex = profile.experience
          .map(item => item.id)
          .indexOf(req.params.exp_id);

        //remove
        profile.experience.splice(removeIndex, 1);

        profile.save().then(profile => res.send(profile));
      })
      .catch(err => res.status(404).json(err));
  }
);

// @route     DELETE api/profile/education/:edu_id
// @desc      delete edu from profile
// @access    Private
router.delete(
  "/education/:edu_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        //find the education
        const removeIndex = profile.education
          .map(item => item.id)
          .indexOf(req.params.edu_id);

        console.log(removeIndex);
        //remove
        profile.education.splice(removeIndex, 1);
        profile.save().then(profile => res.send(profile));
      })
      .catch(err => res.status(404).json(err));
  }
);

// @route     DELETE api/profile/
// @desc      delete user and profile
// @access    Private
router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOneAndRemove({ user: req.user.id }).then(() => {
      User.findOneAndRemove({ _id: req.user.id }).then(() =>
        res.json({ success: true })
      );
    });
  }
);

module.exports = router;
