import React, { Component } from 'react';
import {
    Container,
    Button,
    Form
} from 'semantic-ui-react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { register, login, fetchUser } from '../actions/index';
import { baseURL } from '../helpers/baseURL';

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            username: '',
            password: '',
            confirmPassword: '',
            showValidationMsg: false,
            userExists: false
        }
    }

    invalidRegister() {
        return this.state.name.trim() === '' || this.state.username === '' || this.state.password === '' || this.state.password !== this.state.confirmPassword;
    }

    componentDidUpdate() {
        console.log('auth is ', this.props.auth);
        if(this.props.auth && this.props.auth.user) {
            this.props.history.push(baseURL + '/dashboard');
            this.props.history.goForward();
        }
    }

    async onRegisterClick() {
        if(!this.invalidRegister()) {
            try {
                await this.props.register(this.state.name.trim(), this.state.username.trim(), this.state.password);
                console.log('logging in!');
                await this.props.login(this.state.username.trim(), this.state.password);
                if(this.props.session.access_token) {
                    sessionStorage.access_token = this.props.session.access_token;
                    this.props.fetchUser();
                }
            } catch(e) {
                this.setState({
                    showValidationMsg: true,
                    userExists: true
                });
            }    
        } else {
            this.setState({
                showValidationMsg: true
            });
        }
    }

    renderRegisterForm() {
        return (
            <Form>
                <Form.Field>
                    <label>Name</label>
                    <input 
                        name='name' 
                        placeholder='Full Name'
                        value={this.state.name}
                        onChange={(event) => {
                            this.setState({
                                name: event.target.value
                            });
                        }} />
                </Form.Field>
                <Form.Field>
                    <label>Username</label>
                    <input 
                        name='username' 
                        placeholder="Username"
                        value={this.state.username}
                        onChange={(event) => {
                            if(this.state.userExists) {
                                this.setState({
                                    username: event.target.value,
                                    userExists: false
                                })
                            } else {
                                this.setState({
                                    username: event.target.value
                                });
                            }
                        }} />
                </Form.Field>
                <Form.Field>
                    <label>Password</label>
                    <input 
                        type='password' 
                        name='password' 
                        placeholder="Password"
                        value={this.state.password}
                        onChange={(event) => {
                            this.setState({
                                password: event.target.value
                            })
                        }} />
                </Form.Field>
                <Form.Field>
                    <label>Confirm Password</label>
                    <input 
                        type='password' 
                        name='password' 
                        placeholder="Password"
                        value={this.state.confirmPassword}
                        onChange={(event) => {
                            this.setState({
                                confirmPassword: event.target.value
                            })
                        }} />
                </Form.Field>
                <Button type="submit" onClick={this.onRegisterClick.bind(this)}>Register</Button>
            </Form>
        )
    }

    renderValidationMsg() {
        if(this.state.showValidationMsg) {
            var msg;
            if(this.state.name.trim() === '') {
                msg = "Name cannot be blank!"
            }
            else if(this.state.username.trim() === '') {
                msg = "Username cannot be blank!"
            }
            else if(this.state.password === '') {
                msg = "Must enter a password!"
            }
            else if(this.state.confirmPassword !== this.state.password) {
                msg = "Passwords must match!"
            }
            else if(this.state.userExists) {
                msg = "A user with the same username already exists!"
            }

            return (
                <div style={{color: 'red'}}>{msg}</div>
            )
        }

        return null;
    }

    render() {
        console.log('auth here is ', this.props.auth);
        if(this.props.auth && this.props.auth.user) {
            return null;
        }

        return(
        <Container>
            <div style={{textAlign: 'center'}}>
                <h1>Schedule Hero</h1>
                <div>Register</div>
            </div>
            {this.renderValidationMsg()}
            {this.renderRegisterForm()}
        </Container>
        );
    }
}

function mapStateToProps({ auth, session }) {
    return { auth, session };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        register: register,
        login: login,
        fetchUser
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Register);