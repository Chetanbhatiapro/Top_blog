import React from "react";
import { Link, withRouter as Router } from "react-router-dom";
import Header from "./../Header/Header";
import CommentsForm from "./../CommentsForm";
import Comments from "./../Comments";
import "../../App.scss";
import styled from "styled-components";

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
    // console.log(slug, "This is a slug");
    // TEmp
    // slug = "hello-world-article-vc7j70";
    fetch(`https://conduit.productionready.io/api/articles/${slug}`, {
      // headers: {
      //   Authorization: token
      // }
    })
      .then(res => res.json())
      .then(article => {
        // token = token.split(' ')[1];
        // localStorage.setItem('authToken', JSON.stringify(token));
        this.setState({
          article: article.article
        });
        // , () => console.log(this.state.currentArticle, 'Current Article')
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
    fetch(`https://conduit.productionready.io/api/articles/${slug}`, {
      method: "DELETE",
      headers: {
        authorization: token
      }
    })
      .then(res => this.history.push("/"))
      .catch(err => console.log(err));
  };

  render() {
    const { user, editArticle } = this.props;
    // console.log(user && user.user.username, "user");
    // console.log(data && data.article.title)

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
                            {/* TODO: Add dynamic image */}
                            <img
                              src={
                                this.state.article
                                  ? this.state.article.author.image
                                  : "https://avatoon.net/wp-content/uploads/2018/06/Avatoon-Blog-Cartoon-Avatar.jpg"
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
                            {this.state.article && this.state.article.createdAt}
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
                              onClick={() =>
                                this.deleteArticle(this.state.articleslug)
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
                  {this.state.article && this.state.article.description}
                </p>
                {/* Comments form */}
                <CommentsForm
                  data={this.state.article && this.state.article.slug}
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
