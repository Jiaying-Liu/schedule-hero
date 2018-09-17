import React, { Component } from 'react';
import {
    Button,
    Form,
    Container
} from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { login, fetchUser } from '../actions/index';
import { baseURL } from '../helpers/baseURL';

class Landing extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: ''
        }
    }

    componentDidMount() {
        if(this.props.auth && this.props.auth.user) {
            this.props.history.push(baseURL + '/dashboard')
            this.props.history.goForward();
        }

        // get the user.
        this.props.fetchUser();
    }

    componentDidUpdate() {
        if(this.props.auth && this.props.auth.user) {
            this.props.history.push(baseURL + '/dashboard')
            this.props.history.goForward();
        }
    }

    async onLoginClick() {
        await this.props.login(this.state.username.trim(), this.state.password);
        if(this.props.session.access_token) {
            sessionStorage.access_token = this.props.session.access_token;
            this.props.fetchUser();
        }
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
        var res = (
            <Container>
                <div style={{textAlign: 'center'}}>
                    <h1>Schedule Hero</h1>
                    <div>Here to save the date!</div>
                </div>
                {this.renderLoginForm()}
                <div>Don't have an account? <Link to={baseURL + '/register'}>Sign up!</Link></div>
            </Container>
        )

        return res;
    }
}

function mapStateToProps({ auth, session }) {
    return { auth, session };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        login: login,
        fetchUser: fetchUser
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Landing);