import React, { Component } from "react";
import { Link, withRouter as Router } from "react-router-dom";
import Header from "./../Header/Header";
// import CommentsForm from './../CommentsForm';
import "../../App.scss";
import styled from "styled-components";
import Feed from "../Feed";

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: "",
      user: null,
      isLoading: true,
      active: "my-articles"
    };
  }

  // TODO: Fetch article based on active state
  componentDidMount() {
    const username = this.props.match.params.username;
    this.getUserProfile(username);
    // if (this.props.data) {
    // console.log(username, "Comp, username");
    this.fetchArticles(username);
  }

  // static getDerivedStateFromProps(next, prevState) {
  // if (next && next.userProfile) {
  //   console.log("Next profile");
  //   return {
  //     user: next.userProfile.profile
  //   };
  // } else if (next && next.data.user) {
  //   console.log("Set state user, From profile");
  //   return {
  //     user: next.data.user
  //   };
  // }

  // This method is deprecated and replaced to above one
  // componentWillReceiveProps(next, prev) {
  //   if (next && next.data.user) {
  //     this.setState(
  //       {
  //         user: next.data.user
  //       },
  //       () => this.fetchArticles()
  //     );
  //   } else if (next && next.userProfile) {
  //     console.log("Next profile");
  //     this.setState(
  //       {
  //         user: next.userProfile
  //       },
  //       () => console.log(this.state.user, "User from profile")
  //     );
  //   }
  // this.fetchArticles();
  // console.log(next.data.user.username, 'Component will receive props')
  // }

  fetchArticles = username => {
    // TODO: add author name for following data
    // Make this fetch if active is my-

    // Exract the username from the user props
    // TESTING Purpose
    if (this.state.user) {
      username = this.state.user.profile.username;
      // console.log("Updated username");
    }
    // let { username } = this.state.user.profile;
    // console.log(username, "username");
    // username = 'glory232';
    // Set url on active state
    let url = null;
    if (this.state.active === "my-articles") {
      // console.log('Url 1st')
      url = `https://conduit.productionready.io/api/articles?author=${username}&limit=5&offset=0`;
    } else {
      // console.log('Url 2nd')
      url = `https://conduit.productionready.io/api/articles?favorited=${username}&limit=5&offset=0`;
    }

    //
    let token = JSON.parse(localStorage.getItem("authToken"));
    // Get the toke from localStorage
    token = `Token ${token}`;
    // If token available
    if (localStorage.getItem("authToken")) {
      // Fetches the articles
      fetch(url, {
        headers: {
          authorization: token
        }
      })
        .then(res => res.json())
        .then(data => this.setState({ data, isLoading: false }))
        .catch(err => console.log(err));
    } else {
      // Fetches the articles
      fetch(url)
        .then(res => res.json())
        .then(data => this.setState({ data, isLoading: false }))
        .catch(err => console.log(err));
    }
  };

  /**
   * Changes the active state and calls the fetchArticles method
   * @param {object}
   * @return {undefined}
   */
  handleClick = e => {
    const value = e.target.dataset.value;
    // Check if the state isn't already set same as requested
    if (this.state.active !== value) {
      this.setState(
        {
          active: value
        },
        () => this.fetchArticles()
      );
    }
  };

  getUserProfile = username => {
    // console.log(username, "Username from function");
    // TEmp
    // slug = "hello-world-article-vc7j70";
    fetch(`https://conduit.productionready.io/api/profiles/${username}`)
      .then(res => res.json())
      .then(user => {
        // token = token.split(' ')[1];
        // localStorage.setItem('authToken', JSON.stringify(token));
        // let { profile } = user;
        this.setState({ user });
        // , () => console.log(this.state.currentArticle, 'Current Article')
      })
      .catch(err => console.error(err));
  };

  render() {
    // console.log(this.props.match.params.username, "Got username");
    // Define the username
    // const username = this.props !== null ? this.props.user.user.username : 'author';
    // console.log('render')
    // console.log(this.props, "Profile props");

    return (
      <>
        <Header
          username={this.props.data && this.props.data.user.username}
          handlelogOut={this.props.handlelogOut}
        />
        <Main className="profile-main-container">
          <div className="profile-user-container">
            {/* Hero container */}
            <div className="profile-hero-container">
              <div className="user-profile-card-container center-child">
                {/* Create divs if required */}
                <div className="user-image-container">
                  <img
                    src={
                      // this.props.data
                      this.state.user
                        ? // ? this.props.data.user.image
                          this.state.user.profile.image
                        : "https://static.productionready.io/images/smiley-cyrus.jpg"
                    }
                    alt="author"
                    className="user-profile-image"
                  />
                </div>
                <span className="user-name">
                  {/* {this.props.data && this.props.data.user.username} */}
                  {this.state.user && this.state.user.profile.username}
                </span>
                <p className="user-bio">
                  {/* {this.props.data && this.props.data.user.bio} */}
                  {this.state.user && this.state.user.profile.bio}
                </p>
              </div>
              {/* TODO: Add settings link button */}
              {this.props.data &&
                this.state.user &&
                this.props.data.user.username ===
                  this.state.user.profile.username && (
                  <div className="setting-btn-container text-right">
                    <div className="btn-container">
                      <button className="edit-profile-btn">
                        <span className="settings-icon-container">
                          <i className="icon fas fa-cog"></i>
                        </span>
                        <Link className="edit-profile-link" to="/settings">
                          Edit profile settings
                        </Link>
                      </button>
                    </div>
                  </div>
                )}
            </div>
            {/*  */}
            {/* Add two buttons to change the feed and also refactor the feed component for the props */}
            <div className="user-article-btn-container wrappup">
              <button
                onClick={this.handleClick}
                // className="user-article-btn"
                className={
                  this.state.active === "my-articles"
                    ? "user-article-btn active"
                    : "user-article-btn"
                }
                data-value="my-articles"
              >
                My Articles
              </button>
              <button
                onClick={this.handleClick}
                // className="user-article-btn"
                className={
                  this.state.active === "favorite-articles"
                    ? "user-article-btn active"
                    : "user-article-btn"
                }
                data-value="favorite-articles"
              >
                Favorite Articles
              </button>
            </div>
            <div className="profile-feed-container wrappup">
              <Feed
                data={this.state.data}
                isLoading={this.state.isLoading}
                getArticle={this.props.getArticle}
                // handleFavorite={this.handleFavorite}
                // For updating purpose
                fetchArticles={this.fetchArticles}
              />
            </div>
          </div>
        </Main>
      </>
    );
  }
}

export default Router(Profile);

const Main = styled.main`
  // General
  .wrappup {
    max-width: 900px;
    width: 100%;
    margin: 2rem auto;
  }
  // Profile hero-container
  .profile-hero-container {
    padding-top: 2rem;
    padding-bottom: 1rem;
    background-color: #f3f3f3;
    // User profile card
    .user-profile-card-container {
      // padding: 2rem 0;
      // background-color: #f3f3f3;
      .user-image-container {
        .user-profile-image {
          width: 6rem;
          height: 6rem;
          border-radius: 50px;
        }
      }
      .user-name {
        color: black;
        font-size: 1.4rem;
        font-family: "Source Sans Pro", sans-serif;
        font-weight: 700;
        letter-spacing: 0.08rem;
        padding: 0.6rem 0;
      }
      .user-bio {
        color: #aaa;
        font-size: 0.8rem;
        letter-spacing: 0.07rem;
      }
    }

    // Setting
    .setting-btn-container {
      display: flex;
      justify-content: flex-end;
      width: 85%;
      .settings-icon-container {
        margin-right: 0.2rem;
        .icon {
          font-size: 0.7rem;
          color: #aaa;
        }
      }
    }
    .btn-container {
      // display: flex;
    }
    .edit-profile-btn {
      border: none;
      border: 1px solid rgb(145, 143, 129);
      border-radius: 3px;
      background-color: #f3f3f3;
      // margin: .5rem .2rem;
      &:hover {
        background-color: rgb(189, 187, 174);
        .edit-profile-link {
          text-decoration: none;
        }
      }
      .edit-profile-link {
        font-size: 0.8rem;
        letter-spacing: 0.06rem;
        color: rgb(145, 143, 129);
      }
    }
  }

  // User article
  .user-article-btn-container {
    // max-width: 900px;
    // width: 100%;
    // margin: 2rem auto;
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
      outline: none;
    }
    .active {
      color: rgb(255, 151, 53);
      // padding-bottom: .8rem;
      // border-bottom: 2px solid rgb(255, 151, 53);
    }
  }
`;
