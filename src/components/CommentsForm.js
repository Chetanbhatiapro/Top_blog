import React, { Component } from "react";
import { withRouter as Router } from "react-router-dom";
import "../App.scss";
import styled from "styled-components";

class CommentsForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      body: ""
    };
  }

  handleInput = evt => {
    let { value } = evt.target;
    this.setState({
      body: value
    });
  };

  // https://conduit.productionready.io/api/articles/1-9g9bye/comments
  postComment = slug => {
    // console.log(slug, "Slug from postComment");
    let token = JSON.parse(localStorage.authToken);

    token = `Token ${token}`;

    fetch(`https://conduit.productionready.io/api/articles/${slug}/comments`, {
      method: "POST",
      body: JSON.stringify({ comment: { body: this.state.body } }),
      headers: {
        "Content-Type": "application/json",
        Authorization: token
      }
    })
      .then(res => res.json())
      .then(res => {
        // console.log(res, "Comment success");
        const slug = this.props.match.params.slug;
        this.setState({ body: "" }, () =>
          this.props.history.push(`/article/${slug}`)
        );
      })
      .catch(err => console.error(err));
  };

  render() {
    return (
      <Div className="comment-form-section">
        <div className="form-container">
          <form className="form">
            <textarea
              className="input"
              type="text"
              name="comment"
              placeholder="Write a comment"
              onChange={this.handleInput}
              value={this.state.body}
            />
          </form>
          <div className="form-footer">
            <div className="form-image-container">
              {/* TODO: add dynamic login user image if available */}
              <img
                src="https://avatoon.net/wp-content/uploads/2018/06/Avatoon-Blog-Cartoon-Avatar.jpg"
                alt=""
                className="form-user-pro-image"
              />
            </div>
            <div className="form-btn-container">
              <button
                onClick={() =>
                  localStorage.authToken
                    ? this.postComment(this.props.data)
                    : alert("Please log in first to comment")
                }
                className="btn-submit"
              >
                Post Comment
              </button>
            </div>
          </div>
        </div>
      </Div>
    );
  }
}

export default Router(CommentsForm);

const Div = styled.div`
  // background-color: orange;
  .form-container {
    max-width: 700px;
    width: 100%;
    margin: 0 auto;
    padding: 0 1rem;
  }
  .form {
    // width: 670px;
    width: 100%;
  }
  .input {
    width: 100%;
    height: 100%;
  }
  // Form footer
  .form-footer {
    display: flex;
    justify-content: space-between;
    background-color: #e5e5e5;
    // width: 650px;
    width: 100%;
    // Image
    .form-user-pro-image {
      height: 2rem;
      width: 2rem;
      border-radius: 50px;
      margin: 0.8rem 1.2rem;
    }
    // Button
    .btn-submit {
      font-size: 0.8rem;
      // font-family: $font-family;
      font-weight: 700;
      color: white;
      background-color: rgb(255, 151, 53);
      border: none;
      border-radius: 3px;
      padding: 0.2rem 0.4rem;
      margin: 1rem 1.4rem;
      &:hover {
        background-color: rgb(231, 136, 46);
      }
    }
  }
`;
