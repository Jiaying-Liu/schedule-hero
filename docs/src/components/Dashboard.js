import React, { Component } from 'react';
import {
    Grid,
    Button,
    Modal
} from 'semantic-ui-react';
import TaskTable from './TaskTable';
import AppointTable from './AppointTable';
import DeleteTaskModal from './DeleteTaskModal';
import DeleteAppointModal from './DeleteAppointModal';
import TaskModal from './TaskModal';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { 
    fetchUser, 
    fetchTasks,
    updateTask,
    fetchAppointments,
    deleteTask,
    deleteAppointment
} from '../actions/index';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import { baseURL } from '../helpers/baseURL';
import { isDueWithinWeek } from '../helpers/timeHelper';

import './Dashboard.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';

class Dashboard extends Component {
    constructor(props) {
        super(props);
        BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment));

        this.state = {
            showDeleteTask: false,
            taskToDelete: null,
            showDeleteAppoint: false,
            appointToDelete: null,
            showTaskModal: false,
            taskToShow: null
        }
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
    getTasksDueInWeek() {
        var today = new Date();
        return this.props.tasks.tasks.filter(task => {
            let dueDate = new Date(task.deadline.split(' ')[0]);

            return isDueWithinWeek(dueDate, today);
        });
    }

    onDeleteTaskIconClick(task) {
        this.setState({
            showDeleteTask: true,
            taskToDelete: task
        });
    }

    onDeleteAppointIconClick(appoint) {
        this.setState({
            showDeleteAppoint: true,
            appointToDelete: appoint
        });
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

    confirmDeleteAppointModalRender() {
        if(!this.state.showDeleteAppoint) return null;
        return (
            <DeleteAppointModal
                showDeleteAppoint={this.state.showDeleteAppoint}
                appoint={this.state.appointToDelete}
                onDeleteAppoint={this.onDeleteAppoint.bind(this)}
                cancelCallback={() => {
                    this.setState({
                        showDeleteAppoint: false,
                        appointToDelete: null
                    });
                }} />
        );
    }

    taskTableRender() {
        if(!this.props.tasks || !this.props.tasks.tasks) return null;

        return (
            <TaskTable 
                tasks={this.getTasksDueInWeek()} 
                onDeleteTask={this.onDeleteTaskIconClick.bind(this)} 
                onTaskCheck={this.onTaskCheck.bind(this)}  
            />
        )
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

    taskButtonRender() {
        return (
            <div>
                <Link to={baseURL + '/add-task'}>
                <Button>
                    Add Task
                </Button>
                </Link>
                <Link to={baseURL + '/all-tasks'}>
                    <Button>
                    View All Tasks
                    </Button>
                </Link>
            </div>
        );
    }

    // render appointment components
    getAppointsDueInWeek() {
        var today = new Date();
        return this.props.appointments.appointments.filter(appoint => {
            let dueDate = new Date(appoint.start.split(' ')[0]);

            return isDueWithinWeek(dueDate, today);
        });
    }

    appointTableRender() {
        if(!this.props.appointments || !this.props.appointments.appointments) return null;

        return (
            <AppointTable
                appointments={this.getAppointsDueInWeek()}
                onDeleteAppoint={this.onDeleteAppointIconClick.bind(this)} />
        )
    }

    async onDeleteAppoint(id) {
        await this.props.deleteAppointment(id);
        this.props.fetchAppointments();
        this.setState({
            showDeleteAppoint: false,
            appointToDelete: null
        });
    }

    appointButtonRender() {
        return (
            <div>
                <Link to={baseURL + '/add-appointment'}>
                <Button>
                    Add Appointment
                </Button>
                </Link>
                <Link to={baseURL + '/all-appointments'}>
                    <Button>
                        View All Appointments
                    </Button>
                </Link>
            </div>
        );
    }

    onCalendarTaskClick(task) {
        this.setState({
            showTaskModal: true,
            taskToShow: task
        });
    }

    renderTaskModal() {
        if(!this.state.showTaskModal) return null;

        return (
            <TaskModal
                open={this.state.showTaskModal}
                task={this.state.taskToShow}
                closeCallback={() => {
                    this.setState({
                        showTaskModal: false,
                        taskToShow: null
                    })
                }} />
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
                title: task.name,
                description: task.description,
                done: task.done
            }
        });

        this.props.appointments.appointments.forEach(appoint => {
            events.push({
                allDay: false,
                startDate: new Date(appoint.start),
                endDate: new Date(appoint.end),
                title: appoint.name
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
                    <Grid.Column key={0} width={6}>
                        <div className='schedule-hero-calendar'>
                            <BigCalendar
                                events={this.createEvents()}
                                onSelectEvent={this.onCalendarTaskClick.bind(this)}
                                startAccessor='startDate'
                                endAccessor='endDate'
                                views={['month', 'week', 'agenda']} />
                        </div>
                    </Grid.Column>
                    <Grid.Column key={1} width={5}>
                        <h3>Tasks Due Within a Week</h3>
                        {this.taskTableRender()}
                        {this.taskButtonRender()}
                    </Grid.Column>
                    <Grid.Column key={2} width={5}>
                        <h3>Appointments Within a Week</h3>
                        {this.appointTableRender()}
                        {this.appointButtonRender()}
                    </Grid.Column>
                </Grid>
                {this.confirmDeleteTaskModalRender()}
                {this.confirmDeleteAppointModalRender()}
                {this.renderTaskModal()}
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
        updateTask: updateTask,
        fetchAppointments: fetchAppointments,
        deleteTask: deleteTask,
        deleteAppointment
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);