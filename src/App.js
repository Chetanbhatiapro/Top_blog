import React from "react";
// import logo from './logo.svg';
import "./App.scss";
import { Route, Switch, withRouter as Router } from "react-router-dom";
import MainPage from "./components/Page/MainPage";
import Register from "./components/Page/Register";
import Login from "./components/Page/Login";
import Settings from "./components/Page/Settings";
import ArticleEditor from "./components/Page/ArticleEditor";
import Article from "./components/Page/Article";
import Profile from "./components/Page/Profile";

// TODO: Please check with last route before commit ex: 404
// Add context api or atleast Header component to pass props

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      user: null,
      currentArticle: null
      // userProfile: null
    };
  }

  componentDidMount() {
    if (localStorage.authToken) {
      this.fetchUser(JSON.parse(localStorage.authToken));
    }
  }

  /**
   * Returns routes
   * @return {object}
   *
   */
  Routes = () => {
    if (this.state.user) {
      return (
        <Switch>
          <Route
            exact
            path="/"
            render={() => (
              <MainPage
                getArticle={this.getArticle}
                user={this.state.user}
                // For Header
                handlelogOut={this.handlelogOut}
                // For Get user purpose
                getUserProfile={this.getUserProfile}
              />
            )}
          />
          <Route
            path="/settings"
            render={() => (
              <Settings
                user={this.state.user}
                // For Header
                handlelogOut={this.handlelogOut}
              />
            )}
          />
          <Route
            path="/profile/:username"
            render={() => {
              return (
                <Profile
                  data={this.state.user}
                  getArticle={this.getArticle}
                  // For Header
                  handlelogOut={this.handlelogOut}
                  // For Profile itself
                  userProfile={this.state.userProfile}
                />
              );
            }}
          />
          <Route
            path="/register"
            render={() => <Register fetchUser={this.fetchUser} />}
          />
          <Route
            path="/login"
            render={() => <Login fetchUser={this.fetchUser} />}
          />
          <Route
            path="/article/:slug/edit"
            render={() => (
              <ArticleEditor
                data={this.state.currentArticle}
                user={this.state.user}
                // For Header
                handlelogOut={this.handlelogOut}
              />
            )}
          />
           <Route
            path="/article/create"
            render={() => (
              <ArticleEditor
                data={this.state.currentArticle}
                user={this.state.user}
                // For Header
                handlelogOut={this.handlelogOut}
              />
            )}
          />
          <Route
            path="/article/:slug"
            render={() => {
              return (
                <Article
                  data={this.state.currentArticle}
                  user={this.state.user}
                  // deleteArticle={this.deleteArticle}
                  editArticle={this.editArticle}
                  // For Header
                  handlelogOut={this.handlelogOut}
                />
              );
            }}
          /> 
        </Switch>
      );
    } else {
      return (
        <Switch>
          <Route
            exact
            path="/"
            render={() => (
              <MainPage
                getArticle={this.getArticle}
                // For Get user purpose
                getUserProfile={this.getUserProfile}
              />
            )}
          />
          <Route
            path="/profile/:username"
            render={() => {
              return (
                <Profile
                  data={this.state.user}
                  getArticle={this.getArticle}
                  // For itself
                  userProfile={this.state.userProfile}
                />
              );
            }}
          />
          } />
          <Route
            path="/register"
            render={() => <Register fetchUser={this.fetchUser} />}
          />
          <Route
            path="/login"
            render={() => <Login fetchUser={this.fetchUser} />}
          />
          <Route
            path="/article/:slug"
            render={() => {
              return (
                <Article
                  data={this.state.currentArticle}
                  user={this.state.user}
                  // deleteArticle={this.deleteArticle}
                  editArticle={this.editArticle}
                  // For Header
                  handlelogOut={this.handlelogOut}
                />
              );
            }}
          />
        </Switch>
      );
    }
  };

  /**
   * Fetch the user by token
   * @param {string}
   * @return {undefined}
   */
  fetchUser = token => {
    token = `Token ${token}`;
    fetch("https://conduit.productionready.io/api/user", {
      headers: {
        Authorization: token
      }
    })
      .then(res => res.json())
      .then(user => {
        token = token.split(" ")[1];
        localStorage.setItem("authToken", JSON.stringify(token));
        this.setState({ user });
      })
      .catch(err => console.error(err));
  };

  /**
   * Makes the article delete request
   * @param {string}
   * @return {undefined}
   */
  editArticle = (slug) => {
    // console.log("Got edit req.");
    this.props.history.push(`/article/${slug}/edit`);
  };

  // Open user profile
  // https://conduit.productionready.io/api/profiles/Jack%20H
  // getUserProfile = username => {
  //   // console.log(slug, "This is a slug");
  //   // TEmp
  //   // slug = "hello-world-article-vc7j70";
  //   fetch(`https://conduit.productionready.io/api/profiles/${username}`)
  //     .then(res => res.json())
  //     .then(userProfile => {
  //       // token = token.split(' ')[1];
  //       // localStorage.setItem('authToken', JSON.stringify(token));
  //       this.setState({ userProfile }, () =>
  //         this.props.history.push("/profile")
  //       );
  //       // , () => console.log(this.state.currentArticle, 'Current Article')
  //     })
  //     .catch(err => console.error(err));
  // };

  /**
   * Removes the token from localStorage and set user state to null
   */
  handlelogOut = () => {
    localStorage.removeItem("authToken");
    this.setState({ user: null }, () => this.props.history.push("/"));
  };

  render() {
    return (
      <div className="App">
        {/*TODO: Add last default Route for error 404 */}
        <this.Routes />
      </div>
    );
  }
}

export default Router(App);
