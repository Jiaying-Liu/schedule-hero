import React, { Component } from 'react';
import {
    Button,
    Modal
} from 'semantic-ui-react';
import moment from 'moment';

class AppointModal extends Component {
    render() {
        return (
            <Modal open={this.props.open}>
                <Modal.Header>{this.props.appoint.title}</Modal.Header>
                <Modal.Content>
                    <h3>Description</h3>
                    <p>{this.props.appoint.description}</p>
                    <h3>From</h3>
                    <p>{moment(this.props.appoint.start).format('MMM DD, YYYY HH:mm')}</p>
                    <h3>To</h3>
                    <p>{moment(this.props.appoint.end).format('MMM DD YYYY HH:mm')}</p>
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={this.props.closeCallback}>
                        Close
                    </Button>
                </Modal.Actions>
            </Modal>
        )
    }
}

export default AppointModal;