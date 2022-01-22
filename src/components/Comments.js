import React, { Component } from "react";
import { Link, withRouter as Router } from "react-router-dom";
import user_avatar from "../assets/image/user_avatar.png"
import "../App.scss";
import styled from "styled-components";
import api from "../api";

class Comments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comments: null
    };
  }

  componentWillReceiveProps(next, prev) {
    // console.log(next, "NExt");
    this.fetchComments(next.slug);
  }

  fetchComments = slug => {
    fetch(`${api}/articles/${slug}/comments`)
      .then(res => res.json())
      .then(comments => {
        this.setState({ comments });
      })
      .catch(err => console.error(err));
  };

  deleteComment = (slug, id) => {
    // Get token
    let token = JSON.parse(localStorage.authToken);
    // Refactor token
    token = `Token ${token}`;
    fetch(
      `${api}/articles/${slug}/comments/${id}`,
      {
        method: "DELETE",
        headers: {
          authorization: token
        }
      }
    )
      .then(res => this.fetchComments(slug))
      .catch(err => console.log(err));
  };

  render() {
    // console.log(this.state.comments, "Render");
    return (
      <Div className="comment-section">
        {/* Loop through multiple comments */}
        {this.state.comments &&
          this.state.comments.comments.map(comment => {
            return (
              <div key={comment.id} className="comment-container">
                <div className="comment-text-container">
                  <p className="comment-text">{comment.body}</p>
                </div>
                <footer className="comment-footer">
                  <div className="comment-footer-container">
                    <div className="comment-user-info-container">
                      <img
                        src={
                          comment.author.image
                            ? comment.author.image
                            : user_avatar
                        }
                        alt="profile"
                        className="comment-image"
                      />
                      <Link to={`/profile/${comment.author.username}`}>
                        <h3 className="comment-user-header">
                          {comment.author.username}
                        </h3>
                      </Link>
                      <span className="comment-user-date">
                        {comment.createdAt}
                      </span>
                    </div>
                    {/* Check if the comment posted by same user that is logged in */}
                    {this.props.user &&
                      this.props.user.user.username ===
                        comment.author.username && (
                        <div className="comment-delete-btn-container">
                          <button
                            onClick={() =>
                              this.deleteComment(this.props.slug, comment.id)
                            }
                            className="comment-delete-btn"
                          >
                            <span className="icon-cont">
                              <i className="fas fa-trash-alt"></i>
                            </span>
                          </button>
                        </div>
                      )}
                  </div>
                </footer>
              </div>
            );
          })}
      </Div>
    );
  }
}

export default Router(Comments);

const Div = styled.div`
  .comment-container {
    max-width: 700px;
    width: 100%;
    margin: 1rem auto;
    padding: 0 1rem;
  }
  .comment-text-container {
    border: 1px solid #e5e5e5;
    border-radius: 5px;
    padding: 1rem 0.2rem;
    .comment-text {
      color: rgb(55, 58, 60);
      font-size: 0.8rem;
      margin: 0 1rem;
    }
  }
  .comment-footer-container {
    display: flex;
    justify-content: space-between;
    background-color: #e5e5e5;
    .comment-user-info-container {
      display: flex;
      margin: 1rem;
      .comment-image {
        width: 1.3rem;
        height: 1.3rem;
        border-radius: 50px;
      }
      .comment-user-header {
        font-size: 0.8rem;
        color: rgb(255, 151, 53);
        letter-spacing: 0.01rem;
        margin-left: 0.4rem;
      }
      .comment-user-date {
        font-size: 0.7rem;
        color: rgb(145, 143, 129);
        margin-left: 0.4rem;
      }
    }
    .comment-delete-btn {
      border: none;
      background-color: transparent;
      margin: 1rem;
    }
    .icon-cont {
      font-size: 0.7rem;
      color: rgb(145, 143, 129);
      &:hover {
        color: red;
      }
    }
  }
`;
