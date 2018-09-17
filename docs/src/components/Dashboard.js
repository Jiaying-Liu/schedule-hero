import React, { Component } from 'react';
import {
    Grid,
    Button
} from 'semantic-ui-react';
import TaskTable from './TaskTable';
import AppointTable from './AppointTable';
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

    isDueWithinWeek(dueDate, today) {
        var oneDay = 24*60*60*1000;
        var diff = (dueDate.getTime() - today.getTime()) / oneDay;

        return diff > -1 && diff < 7 
    }

    componentDidUpdate() {
        if(!this.props.auth || !this.props.auth.user) {
            this.props.history.push(baseURL);
            this.props.history.goForward();
        }
    }

    // render task components
    taskTableRender() {
        if(!this.props.tasks || !this.props.tasks.tasks) return null;

        return (
            <TaskTable 
                tasks={this.props.tasks.tasks}    
            />
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
    appointTableRender() {
        if(!this.props.appointments || !this.props.appointments.appointments) return null;

        return (
            <AppointTable
                appointments={this.props.appointments.appointments} />
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
            <div className='schedule-hero-dashboard'>
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
                        {this.taskTableRender()}
                        {this.taskButtonRender()}
                    </Grid.Column>
                    <Grid.Column key={2} width={4}>
                        <h3>Appointments Within a Week</h3>
                        {this.appointTableRender()}
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