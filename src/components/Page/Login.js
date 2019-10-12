import React, { Component } from 'react';
import '../../App.scss';
import { Link, withRouter as Router } from 'react-router-dom';
import Header from '../Header/Header';
import styled from 'styled-components';

class Login extends Component {
    constructor() {
        super();
        this.state = {
            email: '',
            password: '',
            isError: false
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

        fetch('https://conduit.productionready.io/api/users/login', {
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
                throw new Error('There is an error')
            }
        })
        .then(res => {
            this.props.fetchUser(res.user.token);
            this.props.history.push('/')
        })
        .catch(error => console.dir(error))                                     
    }

  render() {
      return (
          <>
          <Header />
            <div className="registeration-form-container">
                <div className="form-main-container center-child">
                    <div className="form-heading-container text-center">
                        <h1 className="form-heading">Sign In</h1>
                        <Link className="login-link" to="/register">Need an account?</Link>
                    </div>
                    {this.state.isError && 
                        <div className='error-container'>
                            <Span className="error-text">email or password is invalid</Span>
                        </div>
                    }
                    <div className="form-container">
                      {/* Todo: update the url */}
                        <form className="form">
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
                            <button className="submit-btn" onClick={this.handleSubmit}>Sign in</button>
                        </form>
                    </div>
                </div>
            </div>
      </>
      )
  }
}
export default Router( Login );

const Span = styled.span`
    color: red;
`