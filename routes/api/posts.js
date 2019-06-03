const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");
const passport = require("passport");

const Post = require("../../models/Post");
const Profile = require("../../models/Profile");

const validatePostInput = require("../../validator/post");

// @route     GET api/posts/test
// @desc      Tests posts route
// @access    Public
router.get("/test", (req, res) => {
  res.json({ msg: "posts works" });
});

// @route     GET api/posts/
// @desc      get posts
// @access    Public
router.get("/", (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then(posts => {
      res.json(posts);
    })
    .catch(err => res.status(404).json({}));
});

// @route     GET api/posts/:id
// @desc      get post by id
// @access    Public
router.get("/:id", (req, res) => {
  Post.findById(req.params.id)
    .then(post => {
      if (post) {
        res.json(post);
      } else {
        res.status(404).json({ nopostfound: "no post found with that id" });
      }
    })
    .catch(err =>
      res.status(404).json({ nopostfound: "no post found with that id" })
    );
});

// @route     POST api/posts
// @desc      Create Posts
// @access    Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    const newPost = new Post({
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id
    });

    newPost.save().then(post => res.json(post));
  }
);

// @route     delete api/posts/:id
// @desc      delete Posts
// @access    Private
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      // console.log(profile);
      //TODO profile === null

      Post.findById(req.params.id)
        .then(post => {
          if (post.user.toString() !== req.user.id) {
            return res
              .status(401)
              .json({ notauthorized: "user not authorized" });
          }
          post.remove().then(() => res.json({ success: true }));
        })
        .catch(() => res.status(404).json({ postnotfound: "No post found" }));
    });
  }
);

// @route     POST api/posts/like/:id
// @desc      like Post by id
// @access    Private
router.post(
  "/like/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      // console.log(profile);
      //TODO profile === null

      Post.findById(req.params.id)
        .then(post => {
          //already liked

          if (
            post.likes.filter(like => like.user.toString() === req.user.id)
              .length > 0
          ) {
            return res
              .status(400)
              .json({ alreadyliked: "user already liked this post" });
          }

          //add user id to array
          post.likes.unshift({ user: req.user.id });

          post.save().then(post => res.json(post));
        })
        .catch(err => res.status(404).json({ postnotfound: "post not found" }));
    });
  }
);

// @route     POST api/posts/unlike/:id
// @desc      unlike Post
// @access    Private
router.post(
  "/unlike/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      // console.log(profile);
      //TODO profile === null

      Post.findById(req.params.id)
        .then(post => {
          //already liked
          console.log(post);
          if (
            post.likes.filter(like => like.user.toString() === req.user.id)
              .length === 0
          ) {
            return res
              .status(400)
              .json({ notliked: "you have not yet liked this post" });
          }

          //remove user id from  array

          const removeIndex = post.likes
            .map(like => like.user.toString())
            .indexOf(req.user.id);
          post.likes.splice(removeIndex, 1);
          post.save().then(post => res.json(post));
        })
        .catch(err => res.status(404).json({ postnotfound: "post not found" }));
    });
  }
);

// @route     POST api/posts/comment/:id
// @desc      add comment to Post
// @access    Private
router.post(
  "/comment/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);
    if (!isValid) {
      res.status(400).json(errors);
    }
    Post.findById(req.params.id)
      .then(post => {
        const newComment = {
          text: req.body.text,
          name: req.body.name,
          avatar: req.body.avatar,
          user: req.user.id
        };

        //add to comment array
        post.comments.unshift(newComment);
        post.save().then(post => res.json(post));
      })
      .catch(err => res.status(404).json({ postnotfound: "No post found" }));
  }
);

// @route     delete api/posts/comment/:id/:comment_id
// @desc      delete comment from Post
// @access    Private
router.delete(
  "/comment/:id/:comment_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findById(req.params.id)
      .then(post => {
        //check comments
        if (
          post.comments.filter(
            comment => comment._id.toString() === req.params.comment_id
          ).length === 0
        ) {
          return res
            .status(404)
            .json({ commentnotexsists: "comment does not exsist" });
        }

        const removeIndex = post.comments
          .map(comment => comment._id.toString())
          .indexOf(req.params.comment_id);

        //permission
        if (post.comments[removeIndex].user.toString() !== req.user.id) {
          return res.status(401).json({ notauthorized: "user not authorized" });
        }

        //splice comment out of array
        post.comments.splice(removeIndex, 1);

        post.save().then(post => res.json(post));
      })
      .catch(err => res.status(404).json({ postnotfound: "No post found" }));
  }
);

module.exports = router;
