import React, { Component } from 'react';
import {
    Header
} from 'semantic-ui-react';
import { Link } from 'react-router-dom';

class AppHeader extends Component {
    render() {
        return (
            <Header as='h3' block>
                <Link to='/'>Schedule Hero</Link>
            </Header>
        )
    }
}

export default AppHeader