import React, { Component } from 'react';
import '../../App.scss';
import { Link, withRouter as Router } from 'react-router-dom';
import Header from '../Header/Header';
import styled from 'styled-components';
import api from '../../api';

class Register extends Component {
    constructor() {
        super();
        this.state = {
            username: '',
            email: '',
            password: '',
            isError: false,
            isLoading: false,
        }
    }

    handleInput = (evt) => {
        const {name, value} = evt.target;
        this.setState({
            [name]: value
        })
    }

    handleSubmit = (e) => {
        e.preventDefault();

        if(!this.state.username || !this.state.email || !this.state.password) return;

        this.setState((prevState) => ({ ...prevState, isLoading: true }), () => {
            fetch(`${api}/users`, {
                method: 'POST',
                body: JSON.stringify({'user': this.state}),
                headers: {
                    'Content-Type': 'application/json'
                },
            })
            .then(res => {
                if (res.ok) {
                    // Redirect the user to home page
                    return res.json();
                }
                else {
                    // Change the state to true for error
                    this.setState({isError: true})
                    // throw new Error('There is an error')
                }
            })
            .then(res => {
                this.props.fetchUser(res.user.token);
                this.props.history.push('/')
            })
            // .catch(error => console.dir(error))

            this.setState((prevState) => ({ ...prevState, isLoading: false }));
        });
    }

  render() {
      return (
          <>
          <Header />
            <div className="registeration-form-container">
                <div className="form-main-container center-child">
                    <div className="form-heading-container text-center">
                        <h1 className="form-heading">Sign Up</h1>
                        <Link className="login-link" to="/login">Have an account?</Link>
                    </div>
                    {/* IF error is true */}
                    {this.state.isError && 
                        <div className='error-container'>
                            <Span className="error-text">Something is wrong</Span>
                        </div>
                    }
                    <div className="form-container">
                      {/* Todo: update the url */}
                        <form className="form" onSubmit={this.handleSubmit}>
                            <input 
                                type="text" 
                                name="username" 
                                className="input" 
                                placeholder="Username"
                                onChange={this.handleInput}
                            />
                            <input 
                                type="email" 
                                name="email" 
                                className="input" 
                                placeholder="Email"
                                onChange={this.handleInput}
                            />
                            <input 
                                type="password" 
                                name="password" 
                                className="input" 
                                placeholder="Password"
                                onChange={this.handleInput}
                            />
                             <div className='action-container'>
                                    <div className="submit-btn-container">
                                        {this.state.isLoading ?
                                            <div className="spinner-border submit-btn-spinner" role="status">
                                                <span className="sr-only">Loading...</span>
                                            </div>
                                            :
                                            <button className="submit-btn">Sign up</button>
                                        }
                                    </div>
                                </div>
                        </form>
                    </div>
                </div>
            </div>
      </>
      )
  }
}

export default Router( Register );

const Span = styled.span`
    color: red;
`