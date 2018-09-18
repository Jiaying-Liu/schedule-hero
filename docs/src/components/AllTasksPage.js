import React, { Component } from 'react';
import {
    Container
} from 'semantic-ui-react';
import TaskTable from './TaskTable';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    fetchUser,
    fetchTasks,
    deleteTask
} from '../actions/index';
import { baseURL } from '../helpers/baseURL';

class AllTasksPage extends Component {
    async componentDidMount() {
        await this.props.fetchUser();
            if(this.props.auth && this.props.auth.user) {
                this.props.fetchTasks();
            } else {
                this.props.history.push(baseURL);
                this.props.history.goForward();
            }
    }

    async onDeleteTask(id) {
        await this.props.deleteTask(id);
        this.props.fetchTasks();
    }

    render() {
        console.log('rendering task table')
        if(!this.props.tasks || !this.props.tasks.tasks) {
            console.log('here');
            return null;
        }

        return (
            <Container>
                <h1 style={{textAlign: 'center'}}>All Tasks</h1>
                <TaskTable
                    tasks={this.props.tasks.tasks}
                    onDeleteTask={this.onDeleteTask.bind(this)} />
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
