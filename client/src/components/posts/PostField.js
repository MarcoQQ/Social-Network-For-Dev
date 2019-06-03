import React, { Component } from "react";
import PropTypes from "prop-types";
import PostItem from "./PostItem";

class PostField extends Component {
  render() {
    const { posts } = this.props;

    return posts.map(post => <PostItem key={post._id} post={post} />);
  }
}

PostField.propTypes = {
  posts: PropTypes.array.isRequired
};

export default PostField;
