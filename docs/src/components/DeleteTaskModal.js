import React, { Component } from 'react';
import {
    Button,
    Modal
} from 'semantic-ui-react';

class DeleteTaskModal extends Component {
    render() {
        return (
            <Modal open={this.props.showDeleteTask}>
                <Modal.Header>Deleting {this.props.task.name}</Modal.Header>
                <Modal.Content>
                    <Modal.Description>
                        <p>Are you sure you want to delete task: {this.props.task.name}?</p>
                    </Modal.Description>
                </Modal.Content>
                <Modal.Actions>
                    <Button
                        onClick={() => {
                            this.props.onDeleteTask(this.props.task.id);
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

export default DeleteTaskModal;