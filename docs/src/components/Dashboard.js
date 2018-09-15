import React, { Component } from 'react';
import {
    Container,
    Grid,
    Table,
    Button
} from 'semantic-ui-react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { fetchUser, fetchTasks } from '../actions/index';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import { baseURL } from '../helpers/baseURL';

import './Dashboard.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';

class Dashboard extends Component {
    constructor(props) {
        super(props);
        BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment));
    }

    async componentDidMount() {
        // assume we are signed in as user. retrieve tasks and appointments
        await this.props.fetchUser();
            if(this.props.auth && this.props.auth.user) {
                this.props.fetchTasks();
            } else {
                this.props.history.push(baseURL);
                this.props.history.goForward();
            }
    }

    componentDidUpdate() {
        if(!this.props.auth || !this.props.auth.user) {
            this.props.history.push(baseURL);
            this.props.history.goForward();
        }
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
                </Table.Row>
            </Table.Header>
        )
    }

    isDueWithinWeek(dueDate, today) {
        var oneDay = 24*60*60*1000;
        var diff = (dueDate.getTime() - today.getTime()) / oneDay;

        return diff > -1 && diff < 7 
    } 

    getTasksDueInWeek() {
        var today = new Date();
        return this.props.tasks.tasks.filter(task => {
            let dueDate = new Date(task.deadline.split(' ')[0]);

            return this.isDueWithinWeek(dueDate, today);
        });
    }

    taskTableBodyRender() {
        if(!this.props.tasks || !this.props.tasks.tasks) {
            return null;
        }

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
                        {task.deadline}
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

    taskButtonRender() {
        return (
            <div>
                <Link to={baseURL + '/add-task'}>
                <Button>
                    Add Task
                </Button>
                </Link>
            </div>
        );
    }

    createEvents() {
        if(!this.props.tasks || !this.props.tasks.tasks) {
            return [];
        }

        return this.props.tasks.tasks.map(task => {
            return {
                allDay: false,
                startDate: new Date(task.deadline),
                endDate: new Date(task.deadline),
                title: 'TASK: ' + task.name
            }
        });
    }

    render() {
        console.log('tasks are ', this.props.tasks);
        if(!this.props.auth || !this.props.auth.user) {
            
            return <div>Session Timed Out</div>
        }

        return (
            <div>
                <h1 style={{'textAlign': 'center'}}>Welcome {this.props.auth.user.name}!</h1>
                <Grid>
                    <Grid.Column key={0} width={8}>
                        <div className='schedule-hero-calendar'>
                            <BigCalendar
                                events={this.createEvents()}
                                startAccessor='startDate'
                                endAccessor='endDate' />
                        </div>
                    </Grid.Column>
                    <Grid.Column key={1} width={4}>
                        <h3>Tasks Due Within a Week</h3>
                        <Table celled>
                            {this.taskTableHeaderRender()}
                            {this.taskTableBodyRender()}
                        </Table>
                        {this.taskButtonRender()}
                    </Grid.Column>
                </Grid>
            </div>
        )
    }
}

function mapStateToProps({ auth, tasks }) {
    return { auth, tasks };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        fetchTasks: fetchTasks,
        fetchUser: fetchUser
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);