import React, { Component } from "react";
import styled from "styled-components";
import Loader from "./Loader.js";

export default class GlobalFeed extends Component {
  constructor() {
    super();
    this.state = {
      data: "",
      isLoading: true
    };
  }

  componentDidMount() {
    fetch("https://conduit.productionready.io/api/tags")
      .then(res => res.json())
      .then(data => this.setState({ data, isLoading: false }));
  }

  handleClick = e => {
    if (e.target.className === "tag-btn") {
      const target = e.target.innerText;
      console.log(target);
      // FetchArticles
      this.props.handleTab(e, target);
    }
  };

  render() {
    return (
      <Div className="tags-container">
        <h1 className="tag-heading">Popular Tags</h1>
        {/* Tags list container */}
        <ul onClick={this.handleClick} className="tags-list-container">
          {this.state.data &&
            this.state.data.tags.map((tag, index) => (
              <li key={index} className="tags-list-item">
                <button className="tag-btn">{tag}</button>
              </li>
            ))}
        </ul>
        {this.state.isLoading && <Loader />}
      </Div>
    );
  }
}

const Div = styled.div`
  background-color: rgb(243, 243, 243);
  border-radius: 10px;
  padding: 0.4rem 0.6rem;
  // Heading
  .tag-heading {
    font-size: 0.9rem;
    margin-left: 0.2rem;
    padding-top: 0.6rem;
  }
  /* Tags list container */
  .tags-list-container {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    color: white;
    .tags-list-item {
      margin: 0.1rem;
      // Tag button
      .tag-btn {
        font-size: 0.8rem;
        color: white;
        background-color: #818a91;
        border: none;
        border-radius: 5px;
        &:hover {
          background-color: #6b7379;
        }
      }
    }
  }
`;
