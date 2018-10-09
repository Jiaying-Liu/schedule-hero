import React, { Component } from 'react';
import {
    Button,
    Modal
} from 'semantic-ui-react';

class DeleteAppointModal extends Component {
    render() {
        return (
            <Modal open={this.props.showDeleteAppoint}>
                <Modal.Header>Deleting {this.props.appoint.name}</Modal.Header>
                <Modal.Content>
                    <Modal.Description>
                        <p>Are you sure you want to delete appointment: {this.props.appoint.name}?</p>
                    </Modal.Description>
                </Modal.Content>
                <Modal.Actions>
                    <Button
                        onClick={() => {
                            this.props.onDeleteAppoint(this.props.appoint.id);
                        }}>
                        Delete
                    </Button>
                    <Button
                        onClick={this.props.cancelCallback}>
                        Cancel
                    </Button>
                </Modal.Actions>
            </Modal>
        );
    }
}

export default DeleteAppointModal;