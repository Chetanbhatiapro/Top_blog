import React from "react";
import "../../App.scss";
import styled from "styled-components";
import { NavLink, Link } from "react-router-dom";

export default function Header({ username, handlelogOut }) {
  // console.log(username, "Props Header");
  let profileUrl = `/profile/${username}`;

  return (
    <header className="main-header">
      {/* <Nav className="navigation-main-container navbar navbar-expand-sm navbar-dark px-sm-5" > */}
      <Nav className="navigation-main-container">
        <div className="nav-heading-container">
          <Link className="nav-link-heading" to="/">
            <h2 className="nav-list-heading">Top blog</h2>
          </Link>
        </div>
        <div className="nav-list-container">
          <ul className="nav-list-container">
            <li className="list-item-links">
              {username ? (
                <>
                  <NavLink
                    activeClassName={"active"}
                    className="link-item"
                    exact
                    to="/"
                  >
                    Home
                  </NavLink>
                  {/* Conditional */}
                  <NavLink
                    activeClassName="active"
                    className="link-item"
                    exact
                    to="/editor"
                  >
                    New Post
                  </NavLink>
                  <NavLink
                    activeClassName="active"
                    className="link-item"
                    exact
                    to="/settings"
                  >
                    Settings
                  </NavLink>
                  <NavLink
                    activeClassName="active"
                    className="link-item"
                    exact
                    to={profileUrl}
                  >
                    {/* {username} */}
                    Profile
                  </NavLink>
                  <button onClick={handlelogOut} className="link-item btn-item">
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <NavLink
                    activeClassName={"active"}
                    className="link-item"
                    exact
                    to="/"
                  >
                    Home
                  </NavLink>
                  {/*  */}
                  <NavLink
                    activeClassName="active"
                    className="link-item"
                    exact
                    to="/login"
                  >
                    Sign in
                  </NavLink>
                  <NavLink
                    activeClassName="active"
                    className="link-item"
                    exact
                    to="/register"
                  >
                    Sign up
                  </NavLink>
                </>
              )}
            </li>
          </ul>
        </div>
      </Nav>
    </header>
  );
}

// Nav element style
const Nav = styled.nav`
  color: var(--primaryColor);
  margin: 0.75rem 6rem;
  display: flex;
  justify-content: space-between;
`;
