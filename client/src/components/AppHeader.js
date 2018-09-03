import React, { Component } from 'react';
import {
    Header
} from 'semantic-ui-react';

class AppHeader extends Component {
    render() {
        return (
            <Header as='h3' block>
                Schedule Hero
            </Header>
        )
    }
}

export default AppHeader