import React, { Component } from 'react';
import {
    Grid,
    Table,
    Button
} from 'semantic-ui-react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { 
    fetchUser, 
    fetchTasks,
    fetchAppointments
} from '../actions/index';
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
                this.props.fetchAppointments();
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

    // render task components

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
                        {moment(task.deadline).format('MMM DD, YYYY HH:mm')}
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

    // render appointment components
    appointTableHeaderRender() {
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
                        Starts
                    </Table.HeaderCell>
                    <Table.HeaderCell>
                        Ends
                    </Table.HeaderCell>
                </Table.Row>
            </Table.Header>
        )
    }

    getAppointsDueInWeek() {
        var today = new Date();
        return this.props.appointments.appointments.filter(appoint => {
            let startDate = new Date(appoint.start.split(' ')[0]);

            return this.isDueWithinWeek(startDate, today);
        });
    }

    appointTableBodyRender() {
        if(!this.props.appointments || !this.props.appointments.appointments) {
            return null;
        }

        var appointsDueInWeek = this.getAppointsDueInWeek().sort((appoint1, appoint2) => {
            let deadline1 = new Date(appoint1.start.split(' ')[0]);
            let deadline2 = new Date(appoint2.start.split(' ')[0]);

            return deadline1.getTime() - deadline2.getTime();
        });

        var rows = appointsDueInWeek.map(appoint => {
            return (
                <Table.Row key={appoint.id}>
                    <Table.Cell>
                        {appoint.name}
                    </Table.Cell>
                    <Table.Cell>
                        {appoint.description}
                    </Table.Cell>
                    <Table.Cell>
                        {moment(appoint.start).format('MMM DD, YYYY HH:mm')}
                    </Table.Cell>
                    <Table.Cell>
                        {moment(appoint.end).format('MMM DD, YYYY HH:mm')}
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

    appointButtonRender() {
        return (
            <div>
                <Link to={baseURL + '/add-appointment'}>
                <Button>
                    Add Appointment
                </Button>
                </Link>
            </div>
        );
    }


    createEvents() {
        if(!this.props.tasks || !this.props.tasks.tasks || !this.props.appointments || !this.props.appointments.appointments) {
            return [];
        }

        var events = this.props.tasks.tasks.map(task => {
            return {
                allDay: false,
                startDate: new Date(task.deadline),
                endDate: new Date(task.deadline),
                title: 'TASK: ' + task.name
            }
        });

        this.props.appointments.appointments.forEach(appoint => {
            events.push({
                allDay: false,
                startDate: new Date(appoint.start),
                endDate: new Date(appoint.end),
                title: 'APPOINTMENT ' + appoint.name
            });
        });

        return events;
    }

    render() {
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
                    <Grid.Column key={2} width={4}>
                        <h3>Appointments Within a Week</h3>
                        <Table celled>
                            {this.appointTableHeaderRender()}
                            {this.appointTableBodyRender()}
                        </Table>
                        {this.appointButtonRender()}
                    </Grid.Column>
                </Grid>
            </div>
        )
    }
}

function mapStateToProps({ auth, tasks, appointments }) {
    return { auth, tasks, appointments };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        fetchTasks: fetchTasks,
        fetchUser: fetchUser,
        fetchAppointments: fetchAppointments
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);