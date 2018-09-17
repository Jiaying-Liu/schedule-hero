import React, { Component } from 'react';
import {
    Container,
    Button,
    Form
} from 'semantic-ui-react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { register } from '../actions/index';

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            username: '',
            password: '',
            confirmPassword: ''
        }
    }

    invalidRegister() {
        return this.state.name.trim() === '' || this.state.username === '' || this.state.password === '' || this.state.password !== this.state.confirmPassword;
    }

    onRegisterClick() {
        if(!this.invalidRegister()) {
            this.props.register(this.state.name.trim(), this.state.username.trim(), this.state.password);
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
                            this.setState({
                                username: event.target.value
                            });
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

    render() {
        return(
        <Container>
            <div style={{textAlign: 'center'}}>
                <h1>Schedule Hero</h1>
                <div>Register</div>
            </div>
            {this.renderRegisterForm()}
        </Container>
        );
    }
}

function mapStateToProps({ session }) {
    return { session };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        register: register
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Register);