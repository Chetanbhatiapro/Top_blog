import React, { Component } from "react";
import "../../App.scss";
import styled from "styled-components";
// import { Link } from 'react-router-dom';
import Header from "../Header/Header";
import Feed from "./../Feed";
import Tags from "./../Tags";
import Pagination from "./../Pagination";
import api from "../../api";

export default class MainPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      activeTab: "global-feed",
      currentPage: 0,
      offset: 0,
      limit: 10, // Default limit
      isLoading: true
    };
  }

  // TODO: Fetch article based on request instead of default to global
  componentDidMount() {
    // Invokes the fetchArticle method
    this.fetchArticles();
    // fetch(
    //   `https://conduit.productionready.io/api/articles?limit=10&offset=${this
    //     .state.currentPage * 10}`
    // )
    //   .then(res => res.json())
    //   .then(data => this.setState({ data, isLoading: false }));
  }

  static derivedStateFromProps(next, prev) {
    if (next.user) {
      return {
        activeTab: "your-feed"
      };
    }
  }
  // TODO: Remove this anti-pattern way of updating state via props
  // componentWillReceiveProps(next, prev) {
  //   if (next.user) {
  //     this.setState(
  //       {
  //         activeTab: "your-feed"
  //       },
  //       () => this.fetchArticles()
  //     );
  //   }
  // }

  /**
   * Fetches articles
   * @return {undefined}
   */
  fetchArticles = tag => {
    let token = JSON.parse(localStorage.getItem("authToken"));
    // Get the toke from localStorage
    token = `Token ${token}`;

    // Checks that activeTab isn't one from your-feed or global feed
    const limit = this.state.limit;
    const offset = this.state.offset;
    if (
      this.state.activeTab !== "your-feed" &&
      this.state.activeTab !== "global-feed"
    ) {
      // Check if user is logged in
      if (this.props.user) {
        fetch(
          `${api}/articles?tag=${tag}&limit=${limit}&offset=${offset}`,
          {
            headers: {
              Authorization: token
            }
          }
        )
          .then(res => res.json())
          .then(data => this.setState({ data, isLoading: false }));
      } else {
        // Runs if there is no user
        fetch(
          `${api}/articles?tag=${tag}&limit=${limit}&offset=${offset}`
        )
          .then(res => res.json())
          .then(data => this.setState({ data, isLoading: false }));
      }
    }
    // Check if activeTab is your-feed
    else if (this.state.activeTab === "your-feed") {
      fetch(
        `${api}/articles/feed?limit=${limit}&offset=${offset}`,
        {
          headers: {
            Authorization: token
          }
        }
      )
        .then(res => res.json())
        .then(data => this.setState({ data, isLoading: false }));
    }
    // Check if your acitveTab has global-feed and user is logged in
    else if (this.state.activeTab === "global-feed" && this.props.user) {
      fetch(
        `${api}/articles?limit=${limit}&offset=${offset}`,
        {
          headers: {
            Authorization: token
          }
        }
      )
        .then(res => res.json())
        .then(data => this.setState({ data, isLoading: false }));
    }
    // Runs if there's no user logged in and acitveTab is your-tab
    else {
      fetch(
        `${api}/articles?limit=${limit}&offset=${offset}`
      )
        .then(res => res.json())
        .then(data => this.setState({ data, isLoading: false }));
    }
  };

  componentDidUpdate(prevProps) {
    if(prevProps.user !== this.props.user) {
      this.fetchArticles();
    }
  }

  /**
   * Updates the currentState with pressed button
   * @param {object}
   * @return {undefined}
   */
  handleNavPage = e => {
    let requestedPage = parseInt(e.target.textContent);
    const currentLimit = this.state.limit;
    const currentPage = this.state.currentPage ? this.state.currentPage : 1;
    let requestedOffset;
    if(requestedPage > currentPage) {
      requestedOffset = ((currentPage + 1) - 1) * currentLimit;
    } else {
      requestedOffset = ((currentPage - 1) - 1) * currentLimit;
    }

    if(requestedPage === 1) {
      // Set to zero as initial was 0 for 1
      requestedPage = 0;
    }
    this.setState({ currentPage: requestedPage, offset: requestedOffset }, () =>
      this.fetchArticles()
    );
  };

  /**
   * Changes the active state and calls the fetchArticles method
   * @param {object}
   * @return {undefined}
   */
  handleTab = (e, tab) => {
    const value = e.target.dataset.value;
    // Check if the state isn't already set same as requested
    if (tab && this.state.active !== tab) {
      this.setState(
        {
          activeTab: tab
        },
        () => this.fetchArticles(tab)
      );
    } else if (this.state.active !== value) {
      this.setState(
        {
          activeTab: value
        },
        () => this.fetchArticles()
      );
    }
  };

  render() {
    const username = this.props.user ? this.props.user.user ? this.props.user.user.username : "" : "";
    return (
      <>
        <Header
          username={username}
          handlelogOut={this.props.handlelogOut}
        />
        <main className="main-container">
          {/*  */}
          <section className="hero-section">
            {this.props.user ? (
              <div className="row">
                <Div className="user-article-btn-container col-10 col-sm-10 col-md-10">
                  <button
                    onClick={this.handleTab}
                    // className="user-article-btn"
                    className={
                      this.state.activeTab === "your-feed"
                        ? "user-article-btn active"
                        : "user-article-btn"
                    }
                    data-value="your-feed"
                  >
                    Your Feed
                  </button>
                  <button
                    onClick={this.handleTab}
                    // className="user-article-btn"
                    className={
                      this.state.activeTab === "global-feed"
                        ? "user-article-btn active"
                        : "user-article-btn"
                    }
                    data-value="global-feed"
                  >
                    Global Feed
                  </button>
                  {this.state.activeTab !== "your-feed" &&
                    this.state.activeTab !== "global-feed" && (
                      <button
                        onClick={this.handleTab}
                        // className="user-article-btn"
                        className={
                          this.state.activeTab !== "your-feed" &&
                          this.state.activeTab !== "global-feed"
                            ? "user-article-btn active"
                            : "user-article-btn"
                        }
                        data-value={this.state.activeTab}
                      >
                        {`#${this.state.activeTab}`}
                      </button>
                    )}
                </Div>
              </div>
            ) : (
              <>
                <div className="hero-container">
                  <div className="hero-text-container center-child">
                    <h1 className="hero-header">Top blog</h1>
                    <p className="hero-para">
                      Best place to share your articles
                    </p>
                  </div>
                </div>
                <div className="row">
                  <Div className="user-article-btn-container col-10 col-sm-10 col-md-10">
                    <button
                      onClick={this.handleTab}
                      // className="user-article-btn"
                      className={
                        this.state.activeTab === "global-feed"
                          ? "user-article-btn active"
                          : "user-article-btn"
                      }
                      data-value="global-feed"
                    >
                      Global Feed
                    </button>
                    {this.state.activeTab !== "your-feed" &&
                      this.state.activeTab !== "global-feed" && (
                        <button
                          onClick={this.handleTab}
                          // className="user-article-btn"
                          className={
                            this.state.activeTab !== "your-feed" &&
                            this.state.activeTab !== "global-feed"
                              ? "user-article-btn active"
                              : "user-article-btn"
                          }
                          data-value={this.state.activeTab}
                        >
                          {`#${this.state.activeTab}`}
                        </button>
                      )}
                  </Div>
                </div>
              </>
            )}
          </section>
          {/* Page section */}
          <section className="page-section">
            <div className="page-container">
              {/* Article preview main container */}
              <div className="container article-preview-main-container">
                <div className="row art-pre-inner-container">
                  {/* Feed */}
                  <div className="col-9 col-sm-9 col-md-9">
                    <Feed
                      data={this.state.data}
                      isLoading={this.state.isLoading}
                      getArticle={this.props.getArticle}
                      // handleFavorite={this.handleFavorite}
                      // For updating purpose
                      fetchArticles={this.fetchArticles}
                      // To handle getUser profile
                      getUserProfile={this.props.getUserProfile}
                    />
                  </div>
                  {/* Tags */}
                  <div className="col-3 col-sm-3 col-md-3">
                    <Tags
                      // fetchArticles={this.fetchArticles}
                      handleTab={this.handleTab}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className="pagination-footer-section">
            {/* Pagination/Navigation */}
            {this.state.data && this.state.data.articlesCount && this.state.data.articlesCount > 10 && (
              <Pagination
                articlesCount={this.state.data.articlesCount}
                handleNavPage={this.handleNavPage}
                currentPage={this.state.currentPage}
              />
            )}
          </section>
        </main>
      </>
    );
  }
}

const Div = styled.div`
  max-width: 1100px;
  width: 100%;
  margin: 2rem auto;
  // background-color: tomato;
  display: flex;
  justify-content: flex-start;
  // padding-bottom: .6rem;
  // border-bottom: 1px solid #ebebeb;
  // Child
  .user-article-btn {
    // width:
    font-family: "Source Sans Pro", sans-serif;
    font-weight: 600;
    border: none;
    background-color: transparent;
    color: #aaa;
    margin-right: 1.5rem;
    padding-bottom: 0.7rem;
    &:focus {
      outline: none;
    }
  }
  .active {
    color: rgb(255, 151, 53);
    // padding-bottom: 1rem;
    border-bottom: 2px solid tomato;
    // padding-bottom: .8rem;
    // border-bottom: 2px solid rgb(255, 151, 53);
  }
`;
