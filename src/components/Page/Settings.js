import React from "react";
import "../../App.scss";
import styled from "styled-components";
import Header from "../Header/Header";
import { withRouter as Router } from "react-router-dom";
import api from "../../api";

class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // user: {}
      email: "",
      image: "",
      bio: "",
      password: "",
      username: "",
      isError: false
    };
  }

  componentDidMount() {
    const { username, email, bio, image } = this.props.user.user;
    this.setState({
      username,
      email,
      bio,
      image
    });
  }

  /**
   * Update the state based on user input
   * @param {object}
   * @return {undefined}
   */
  handleInput = evt => {
    let { name, value } = evt.target;
    this.setState({
      [name]: value
    });
  };

  /**
   * Make fetch request
   * @param {object}
   * @return {undefined}
   */
  handleSubmit = e => {
    e.preventDefault();

    let token = JSON.parse(localStorage.getItem("authToken"));
    // Get the toke from localStorage
    token = `Token ${token}`;

    // Define user
    let user = {
      username: this.state.username,
      email: this.state.email,
      bio: this.state.bio,
      image: this.state.image
    };
    // Check for password should not be blank
    // Only adds password to the user if it updated
    if (this.state.password !== "") {
      user["password"] = this.state.password;
    }

    // Fetch the update user request
    fetch(`${api}/user`, {
      method: "PUT",
      body: JSON.stringify({ user: user }),
      headers: {
        "Content-Type": "application/json",
        Authorization: token
      }
    })
      .then(res => {
        if (res.ok) {
          // Redirect the user to home page
          return res.json();
        } else {
          // Change the state to true for error
          this.setState({ isError: true });
          throw new Error("There is an error");
        }
      })
      .then(res => {
        // this.props.fetchUser(res.user.token);
        this.props.history.push("/");
      })
      .catch(error => console.dir(error));
  };

  render() {
    return (
      <>
        <Header
          username={this.state.username}
          handlelogOut={this.props.handlelogOut}
        />
        <Div className="container setting-main-container">
          <div className="settings-container center-child">
            {/* Heading settings container */}
            <div className="setting-heading-container">
              <h1 className="setting-heading">Profile settings</h1>
            </div>
            {/* Shows if there is an error */}
            {this.state.isError && (
              <div className="error-container">
                <span className="error-text">
                  Username and email should not be empty
                </span>
              </div>
            )}
            {/* Form settings form container */}
            <div className="form-container">
              {/* Todo: update the url */}
              <form className="form">
                <input
                  type="text"
                  name="image"
                  className="input"
                  placeholder="URL of profile picture"
                  // value={this.state.user && this.state.user.image ? this.state.user.image : ''}
                  value={this.state.image}
                  onChange={this.handleInput}
                />
                <input
                  type="text"
                  name="username"
                  className="input"
                  placeholder="Username"
                  // value={this.state.user && this.state.user.username ? this.state.user.username : ''}
                  value={this.state.username}
                  onChange={this.handleInput}
                  required={true}
                />
                <textarea
                  type="text"
                  name="bio"
                  className="input"
                  placeholder="Short bio"
                  // value={this.state.user && this.state.user.bio ? this.state.user.bio : ''}
                  value={this.state.bio}
                  onChange={this.handleInput}
                />
                <input
                  type="email"
                  name="email"
                  className="input"
                  placeholder="Email"
                  // value={this.state.user && this.state.user.email ? this.state.user.email : ''}
                  value={this.state.email}
                  onChange={this.handleInput}
                  required={true}
                />
                <input
                  type="password"
                  name="password"
                  className="input"
                  placeholder="New Password"
                  value={this.state.password}
                  onChange={this.handleInput}
                />
                <button className="submit-btn" onClick={this.handleSubmit}>
                  Update Settings
                </button>
              </form>
            </div>
          </div>
        </Div>
      </>
    );
  }
}

export default Router(Settings);

const Div = styled.div`
  .error-text {
    color: red;
  }
  .setting-heading {
    font-size: 2.1rem;
  }
`;
