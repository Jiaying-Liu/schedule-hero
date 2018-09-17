import React, { Component } from 'react';
import {
    Table,
    Checkbox
} from 'semantic-ui-react';
import moment from 'moment';

class TaskTable extends Component {
    isDueWithinWeek(dueDate, today) {
        var oneDay = 24*60*60*1000;
        var diff = (dueDate.getTime() - today.getTime()) / oneDay;

        return diff > -1 && diff < 7 
    }

    taskTableHeaderRender() {
        return (
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>
                        Name
                    </Table.HeaderCell>
                    <Table.HeaderCell>
                        Description
                    </Table.HeaderCell>
                    <Table.HeaderCell>
                        Deadline
                    </Table.HeaderCell>
                    <Table.HeaderCell>
                        Done
                    </Table.HeaderCell>
                    <Table.HeaderCell>
                        Edit/Delete
                    </Table.HeaderCell>
                </Table.Row>
            </Table.Header>
        )
    }

    getTasksDueInWeek() {
        var today = new Date();
        return this.props.tasks.filter(task => {
            let dueDate = new Date(task.deadline.split(' ')[0]);

            return this.isDueWithinWeek(dueDate, today);
        });
    }

    taskTableBodyRender() {
        var tasksDueInWeek = this.getTasksDueInWeek().sort((task1, task2) => {
            let deadline1 = new Date(task1.deadline.split(' ')[0]);
            let deadline2 = new Date(task2.deadline.split(' ')[0]);

            return deadline1.getTime() - deadline2.getTime();
        });

        var rows = tasksDueInWeek.map(task => {
            return (
                <Table.Row key={task.id}>
                    <Table.Cell>
                        {task.name}
                    </Table.Cell>
                    <Table.Cell>
                        {task.description}
                    </Table.Cell>
                    <Table.Cell>
                        {moment(task.deadline).format('MMM DD, YYYY HH:mm')}
                    </Table.Cell>
                    <Table.Cell>
                        <Checkbox checked={task.done} />
                    </Table.Cell>
                    <Table.Cell>
                        <div 
                            style={{
                                display: 'flex',
                                justifyContent: 'flex-end'
                            }}>
                            <i
                                style={{ paddingRight: '8px' }}
                                title='Edit'
                                className='fa fa-edit fa-lg' />
                            <i 
                                title='Delete'
                                onClick={() => {
                                    this.props.onDeleteTask(task.id);
                                }}
                                style={{ paddingRight: '8px' }}
                                className='fa fa-trash fa-lg' />
                        </div>
                    </Table.Cell>
                </Table.Row>
            );
        });

        return (
            <Table.Body>
                {rows}
            </Table.Body>
        )
    }

    render() {
        return (
            <Table celled>
                {this.taskTableHeaderRender()}
                {this.taskTableBodyRender()}
            </Table>
        )
    }
}

export default TaskTable;