import React, { Component } from "react";
import { Link, withRouter as Router } from "react-router-dom";
import Loader from "./Loader.js";

class Feed extends Component {
  // constructor() {
  //   super();
  //   this.state = {
  //     data: '',
  //     isLoading: true
  //   }
  // }

  // componentDidMount() {
  //   fetch("https://conduit.productionready.io/api/articles?limit=10&offset=0")
  //   .then(res => res.json())
  //   .then(data => this.setState({data, isLoading: false}))
  // }

  /**
   * Makes push and delete request on article favorite
   * @param {string}
   * @param {boolean}
   * @return {undefined}
   */
  handleFavorite = (slug, favorited) => {
    // TEmp
    // console.log(slug, "Slug, HandleFavorite");
    // console.log(favorited, "Favorited status");
    // slug = "hello-world-article-vc7j70";
    let token = JSON.parse(localStorage.getItem("authToken"));
    // Get the toke from localStorage
    token = `Token ${token}`;

    // Checks that article is already favorited by the user or not
    if (!favorited) {
      fetch(
        `https://conduit.productionready.io/api/articles/${slug}/favorite`,
        {
          method: "POST",
          headers: {
            Authorization: token
          }
        }
      )
        .then(res => res.json())
        .then(res => this.props.fetchArticles())
        .catch(err => console.error(err));
    } else {
      fetch(
        `https://conduit.productionready.io/api/articles/${slug}/favorite`,
        {
          method: "DELETE",
          headers: {
            Authorization: token
          }
        }
      )
        .then(res => res.json())
        .then(res => this.props.fetchArticles())
        .catch(err => console.error(err));
    }
  };

  getUserProfile = username => {
    this.props.history.push(`/profile/${username}`);
  };

  render() {
    // Destructure the data and isLoading from props
    const { data, isLoading, getArticle } = this.props;
    // console.log(getArticle, "Props getArticle");

    return (
      <>
        {data &&
          data.articles.map(
            (article, index) => (
              // {/* Article preview card container */}
              <div key={index} className="art-pre-card-cont">
                {/* First top container */}
                <div className="art-pre-card-info-cont">
                  {/* Image and user info container */}
                  <div className="art-pre-card-user-cont">
                    {/* User profile image container */}
                    <div className="user-pro-img-container">
                      <Link
                        onClick={() =>
                          this.getUserProfile(article.author.username)
                        }
                        to="#"
                        className="img-pre-link"
                      >
                        <img
                          src={
                            article.author.image
                              ? article.author.image
                              : "https://static.productionready.io/images/smiley-cyrus.jpg"
                          }
                          alt="profile"
                          className="img-pre"
                        />
                      </Link>
                    </div>
                    {/* Basic article and user info container */}
                    <div className="user-basic-info">
                      <Link
                        onClick={() =>
                          this.getUserProfile(article.author.username)
                        }
                        className="art-pro-link"
                        to="#"
                      >
                        {article.author.username}
                      </Link>
                      <span className="date-text">{article.createdAt}</span>
                    </div>
                  </div>
                  {/* Like button */}
                  <div
                    className={`like-art-pre-cont ${
                      article.favorited ? "true" : ""
                    }`}
                  >
                    <button
                      onClick={() =>
                        localStorage.authToken
                          ? this.handleFavorite(article.slug, article.favorited)
                          : alert("Please log in first to favorite")
                      }
                      className="like-art-btn"
                    >
                      <span className={`like-art-icon-cont`}>
                        <i className="icon fas fa-heart"></i>
                      </span>
                    </button>
                    <span className="like-art-count">
                      {article.favoritesCount}
                    </span>
                  </div>
                  {/*  */}
                </div>
                {/*Basic article and artic"le info container */}
                <div className="art-pre-art-basic-cont">
                  <div className="art-pre-cont">
                    <Link
                      // onClick={() => getArticle(article.slug)}
                      className="art-pre-link-cont"
                      // to="/article"
                      to={`/article/${article.slug}`}
                    >
                      <h1 className="art-pre-heading">{article.title}</h1>
                      <p className="art-pre-para">{article.description}</p>
                    </Link>
                  </div>
                </div>
                {/* Link and tag container */}
                <div className="art-pre-footer">
                  <div className="art-pre-link-cont">
                    <Link
                      onClick={() => getArticle(article.slug)}
                      to="/article"
                      className="art-pre-text-link"
                    >
                      Read more
                    </Link>
                  </div>
                  {/* Article preview tag container */}
                  <div className="art-pre-tag-cont">
                    <ul className="art-pre-tags-list">
                      {/* Tag list */}
                      {article.tagList.map((tag, index) => (
                        <li key={index} className="art-pre-list-item">
                          <Link className="art-pre-list-item-link" to="#">
                            {tag}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )
            // End of the card
          )}
        {isLoading && (
          <div className="feed-loader">
            <Loader />
          </div>
        )}
        {data && data.articles.length <= 0 && (
          <p className="no-articles-text">No Articles available</p>
        )}
      </>
    );
  }
}

export default Router(Feed);
