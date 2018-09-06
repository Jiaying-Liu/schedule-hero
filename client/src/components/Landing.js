import React, { Component } from 'react';
import {
    Button,
    Form
} from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { login } from '../actions/index';

class Landing extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: ''
        }
    }

    onLoginClick() {
        this.props.login(this.state.username, this.state.password);
    }

    renderLoginForm() {
        return (
            <Form>
                <Form.Field>
                    <label>Username</label>
                    <input 
                        name='username' 
                        placeholder="Username"
                        value={this.state.username}
                        onChange={(event) => {
                            this.setState({
                                username: event.target.value
                            })
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
                <Button onClick={this.onLoginClick.bind(this)} type="submit">Login</Button>
            </Form>
        );
    }

    render() {
        return (
            <div>
                <div style={{textAlign: 'center'}}>
                    <h1>Schedule Hero</h1>
                    <div>Here to save the date!</div>
                </div>
                {this.renderLoginForm()}
                <div>Don't have an account? <Link to='/register'>Sign up!</Link></div>
            </div>
        )
    }
}

function mapStateToProps({ session }) {
    return { session };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        login: login
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Landing);