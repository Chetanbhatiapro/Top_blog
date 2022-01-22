import React, { Component } from "react";
import Header from "../Header/Header";
import styled from "styled-components";
import { withRouter as Router } from "react-router-dom";
import api from "../../api";

class ArticleEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      description: "",
      body: "",
      tagList: "",
      slug: "",
      isEdit: false
    };
  }

  componentDidMount() {
    const slug = this.props.match.params.slug;
    if(slug) {
      this.getArticle(slug);
    }
  }

    /**
   * Make get article request and change the state
   * @param {string}
   * @return {undefined}
   */
     getArticle = slug => {
      fetch(`${api}/articles/${slug}`, {
      })
        .then(res => res.json())
        .then(data => {
        const {
          title,
          description,
          body,
          tagList,
          } = data.article;
  
          // Update the state based on props
          this.setState({
            title,
            description,
            body,
            tagList: tagList.join(","),
            slug,
            isEdit: true
          });
        })
        .catch(err => console.error(err));
    };

  /**
   * Update the state based on user inputs
   * @param {object}
   * @return {undefined}
   */
  handleInput = evt => {
    // Handle tagInput or tagList as required for the request
    let { name, value } = evt.target;
    this.setState({
      [name]: value
    });
  };

  /**
   * Fetch put or post request based on condition
   * @param {object}
   * @return {undefined}
   */
  handleSubmit = e => {
    e.preventDefault();

    // Exract the authToken
    let token = JSON.parse(localStorage.getItem("authToken"));
    // Modify the token
    token = `Token ${token}`;
    // Define article
    const tags = this.state.tagList.split(",")
    let article = {
      title: this.state.title,
      description: this.state.description,
      body: this.state.body,
      tagList: this.state.tagList ? tags : ""
    };

    // Define the url and currentMethod
    let currentMethod = "POST";
    let url = `${api}/articles`;

    // Change url and null based on condition
    if (this.state.isEdit) {
      url = `${api}/articles/${this.state.slug}`;
      currentMethod = "PUT";
    }

    // Fetch the update or post new article request based on condition
    fetch(url, {
      method: currentMethod,
      body: JSON.stringify({ article: article }),
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
          username={this.props.user.user.username}
          handlelogOut={this.props.handlelogOut}
        />
        <Div className="post-article-main-container">
          <div className="post-form-container center-child">
            <form className="post-form">
              <input
                type="text"
                name="title"
                className="input"
                placeholder="Title"
                value={this.state.title}
                onChange={this.handleInput}
              />
              <input
                type="text"
                name="description"
                className="input"
                placeholder="Short description"
                value={this.state.description}
                onChange={this.handleInput}
              />
              <textarea
                type="text"
                name="body"
                className="input textarea"
                placeholder="Article Body (Write in markdown)"
                value={this.state.body}
                onChange={this.handleInput}
              />
              <input
                type="text"
                name="tagList"
                className="input"
                placeholder="Related tags"
                value={this.state.tagList}
                onChange={this.handleInput}
              />
              <button className="submit-btn" onClick={this.handleSubmit}>
                Publish
              </button>
            </form>
          </div>
        </Div>
      </>
    );
  }
}

export default Router(ArticleEditor);

const Div = styled.div`
  .post-form-container {
    width: 100%;
    height: 100%;
    margin-top: 4rem;
  }
  .input {
    width: 100%;
    height: 100%;
    padding: 0.9rem 1.5rem;
    margin: 0.4rem 0;
    border: 1px solid rgb(211, 209, 209);
    border-radius: 5px;
    &::placeholder {
      color: rgb(156, 154, 154);
      font-size: 1.18rem;
    }
  }
  .textarea {
    height: 200px;
  }
  .submit-btn {
    background-color: rgb(255, 151, 53);
    color: white;
    border: none;
    padding: 0.8rem 1.8rem;
    border-radius: 5px;
    margin-top: 0.6rem;
    &:hover {
      background-color: rgb(231, 136, 46);
    }
  }
`;
