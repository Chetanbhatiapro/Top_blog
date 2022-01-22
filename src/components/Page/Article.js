import React from "react";
import { Link, withRouter as Router } from "react-router-dom";
import user_avatar from "../../assets/image/user_avatar.png"
import Header from "./../Header/Header";
import CommentsForm from "./../CommentsForm";
import Comments from "./../Comments";
import "../../App.scss";
import styled from "styled-components";
import api from "../../api";

class Article extends React.Component {
  state = {
    article: null
  };

  componentDidMount() {
    const slug = this.props.match.params.slug;
    this.getArticle(slug);
  }

  /**
   * Make get article request and change the state
   * @param {string}
   * @return {undefined}
   */
  getArticle = slug => {
    fetch(`${api}/articles/${slug}`)
      .then(res => res.json())
      .then(article => {
        this.setState({
          article: article.article
        });
      })
      .catch(err => console.error(err));
  };

  /**
   * Makes the article delete request
   * @param {string}
   * @return {undefined}
   */
  deleteArticle = slug => {
    // Get token
    let token = JSON.parse(localStorage.authToken);
    // Refactor token
    token = `Token ${token}`;
    fetch(`${api}/articles/${slug}`, {
      method: "DELETE",
      headers: {
        authorization: token
      }
    })
      .then(() => this.props.history.push("/"))
      .catch(err => console.log(err));
  };

  render() {
    const { user, editArticle } = this.props;

    return (
      <>
        <Header
          username={user && user.user.username}
          handlelogOut={this.props.handlelogOut}
        />
        <main className="article-main">
          <article className="article-section">
            <Div className="article-container">
              <div className="article-hero-container">
                <div className="article-hero-text-container">
                  {/* Article header container */}
                  <div className="article-header-container">
                    <h1 className="article-heading">
                      {this.state.article && this.state.article.title}
                    </h1>
                  </div>
                  {/* Article basic option container */}
                  <div className="article-basic-option-container">
                    {/* User basic info */}
                    <div className="article-author-info-container">
                      {/* Article author basic info */}
                      <div className="article-author-info-cont">
                        <div className="article-author-image-container">
                          {/* TODO: Add link of user or event */}
                          <Link
                            className="article-author-link"
                            to={`/profile/${this.state.article &&
                              this.state.article.author.username}`}
                          >

                            <img
                              src={
                                this.state.article
                                  ? this.state.article.author.image
                                  : user_avatar
                              }
                              alt=""
                              className="article-pro-image"
                            />
                          </Link>
                        </div>
                        <div className="article-basic-info-cont">
                          <Link
                            className="article-author-link"
                            to={`/profile/${this.state.article &&
                              this.state.article.author.username}`}
                          >
                            <span className="article-author">
                              {/* Add author info */}
                              {this.state.article &&
                                this.state.article.author.username}
                            </span>
                          </Link>
                          <span className="article-publish-info">
                            {/* Add article publish date and tiem */}
                            {this.state.article ? new Date(this.state.article.createdAt).toUTCString() : null}
                          </span>
                        </div>
                      </div>
                      {user &&
                        this.state.article &&
                        user.user.username ===
                          this.state.article.author.username && (
                          <div className="article-option-container">
                            {/* {Do conditional rendering for these} */}
                            {/* onClick={() => editArticle(data.article.slug)}  */}
                            <button
                              onClick={() =>
                                editArticle(this.state.article.slug)
                              }
                              className="article-btn btn-edit"
                            >
                              <span className="icon-cont">
                                <i className="fas fa-pencil-alt"></i>
                              </span>
                              Edit Article
                            </button>
                            <button
                              onClick={() => {
                                const slug = this.state.article ? this.state.article.slug : '';
                                this.deleteArticle(slug)
                                }
                              }
                              className="article-btn btn-delete"
                            >
                              <span className="icon-cont">
                                <i className="fas fa-trash-alt"></i>
                              </span>
                              Delete Article
                            </button>
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              </div>
              {/* Article description */}
              <div className="article-description-container">
                <p className="article-description">
                  {this.state.article && this.state.article.body}
                </p>
                {/* Comments form */}
                <CommentsForm
                  slug={this.state.article && this.state.article.slug}
                  authorImage={this.state.article && this.state.article.author.image}
                />
                {/* Comment */}
                <Comments
                  user={user ? user : ""}
                  slug={this.state.article && this.state.article.slug}
                />
              </div>
            </Div>
          </article>
        </main>
      </>
    );
  }
}

export default Router(Article);

const Div = styled.div`
.article-hero-container {
  background-color: black;
  color: white;
  .article-hero-text-container {
    max-width: 1150px;
    width: 100%;
    margin: 0 auto;
    padding: 0 1rem;
  }
  .article-header-container {
    padding: 2rem 0;
    .article-heading {
      font-size: 2.8rem;
    }
  }
  .article-author-info-container {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    max-width: 400px;
    min-width: 100px;
  }
  // User basic info
  .article-author-info-cont {
    display: flex;
    justify-content: flex-start;
    margin-bottom: 2rem;
    // Image
    .article-pro-image {
      width: 2rem;
      height: 2rem;
      border-radius: 50px;
    }
  }
  // Author and publish date
  .article-basic-info-cont {
    margin-left: .4rem;
  }
  .article-author-link {
    color: white;
  }
  .article-author {
    font-weight: bold;
    display: block;
    font-size: .9rem;
  }
  .article-publish-info {
    display: block;
    font-size: .7rem;
  }

  .article-option-container {
    margin-bottom: 10px;
  }
  // Buttons
  .article-btn {
    font-size: .8rem;
    color: white;
    background-color: black;
    padding: .2rem .4rem;
    border: none;
    border: 1px solid white;
    border-radius: 5px;
    margin: 0 .05rem;
    .icon-cont {
      margin-right: .2rem;
    }
  }
  .btn-edit:hover {
    background-color: white;
    color: black;
  }
  .btn-delete {
    background-color: black;
    color: red;
    &:hover {
      background-color: red;
      color: white;
    }
  }
}
// Article description
    .article-description-container {
      max-width: 1150px;
      width: 100%;
      margin: 2rem auto;
      padding: 0 1rem;
      .article-description {
        font-family: 'Source Sans Pro', sans-serif;
        color: #373a3c;
        font-size: 1.1rem;
        line-height: 1.5;
        font-weight: 600;
        border-bottom: 1px solid rgba(0,0,0,.2);
        padding-bottom: 4rem;
      }
    }
}
`;
