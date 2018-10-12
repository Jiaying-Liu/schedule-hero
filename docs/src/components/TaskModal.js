import React, { Component } from 'react';
import {
    Button,
    Modal
} from 'semantic-ui-react';
import moment from 'moment';

class TaskModal extends Component {
    render() {
        return (
            <Modal open={this.props.open}>
                <Modal.Header>{this.props.task.title}</Modal.Header>
                <Modal.Content>
                    <h3>Description</h3>
                    <p>{this.props.task.description}</p>
                    <h3>Due</h3>
                    <p>{moment(this.props.task.deadline).format('MMM DD, YYYY HH:mm')}</p>
                    <h3>Done?</h3>
                    <p>{this.props.task.done ? 'Yes' : ' No'}</p>
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

export default TaskModal;