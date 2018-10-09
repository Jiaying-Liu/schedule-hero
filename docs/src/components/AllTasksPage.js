import React, { Component } from 'react';
import {
    Container
} from 'semantic-ui-react';
import TaskTable from './TaskTable';
import DeleteTaskModal from './DeleteTaskModal'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    fetchUser,
    fetchTasks,
    deleteTask
} from '../actions/index';
import { baseURL } from '../helpers/baseURL';

class AllTasksPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            taskToDelete: null,
            showDeleteTask: false
        }
    }

    async componentDidMount() {
        await this.props.fetchUser();
            if(this.props.auth && this.props.auth.user) {
                this.props.fetchTasks();
            } else {
                this.props.history.push(baseURL);
                this.props.history.goForward();
            }
    }

    confirmDeleteTaskModalRender() {
        if(!this.state.showDeleteTask) return null;
        return (
            <DeleteTaskModal
                showDeleteTask={this.state.showDeleteTask}
                task={this.state.taskToDelete}
                onDeleteTask={this.onDeleteTask.bind(this)}
                cancelCallback={() => {
                    this.setState({
                        showDeleteTask: false,
                        taskToDelete: null
                    });
                }} />
        );
    }

    onDeleteTaskIconClick(task) {
        console.log('deleting icon click');
        this.setState({
            showDeleteTask: true,
            taskToDelete: task
        });
    }

    async onDeleteTask(id) {
        await this.props.deleteTask(id);
        this.props.fetchTasks();
        this.setState({
            showDeleteTask: false,
            taskToDelete: null
        });
    }

    async onTaskCheck(task) {
        const { id, name, description, deadline, done } = task;
        await this.props.updateTask(id, name, description, deadline, !done);
        this.props.fetchTasks();
    }

    render() {
        if(!this.props.tasks || !this.props.tasks.tasks) {
            return null;
        }

        return (
            <Container>
                <h1 style={{textAlign: 'center'}}>All Tasks</h1>
                <TaskTable
                    tasks={this.props.tasks.tasks}
                    onDeleteTask={this.onDeleteTaskIconClick.bind(this)}
                    onTaskCheck={this.onTaskCheck.bind(this)} />
                {this.confirmDeleteTaskModalRender()}
            </Container>
        )
    }
}

function mapStateToProps({ auth, tasks }) {
    return { auth, tasks };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        fetchTasks: fetchTasks,
        fetchUser: fetchUser,
        deleteTask: deleteTask
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(AllTasksPage);
