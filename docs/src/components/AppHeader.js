import React, { Component } from 'react';
import {
    Header
} from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchUser } from '../actions/index';
import { baseURL } from '../helpers/baseURL';

class AppHeader extends Component {
    componentDidMount() {
        this.props.fetchUser();
    }

    onLogoutClick() {
        sessionStorage.access_token = null;
        this.props.history.push(baseURL);
        this.props.history.goForward();
    }

    renderLinks() {
        const links = [];
        const homeLink = (
            <Link key={1} to='/schedule-hero'>Schedule Hero</Link>
        );
        links.push(homeLink);

        if(this.props.auth && this.props.auth.user) {
            const logoutLink = (
                <Link key={2} to='/schedule-hero'
                    style={{ float: 'right' }} 
                    onClick={this.onLogoutClick.bind(this)}>
                    Logout
                </Link>
            );
            links.push(logoutLink);
        }

        return links;
    }

    render() {
        return (
            <Header as='h3' block>
                { this.renderLinks() }
            </Header>
        )
    }
}

function mapStateToProps({ auth }) {
    return { auth };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        fetchUser: fetchUser
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(AppHeader);