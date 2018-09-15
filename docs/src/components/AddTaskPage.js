import React, { Component } from 'react';
import {
    Container,
    Form,
    Button
} from 'semantic-ui-react';
import DatePicker from 'react-datepicker';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchUser, addTask } from '../actions/index';
import { baseURL } from '../helpers/baseURL';
import moment from 'moment';

import './AddTaskPage.css';

class AddTaskPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: '',
            description: '',
            dueDate: moment(),
            dueTime: '00:00',
            openDate: false,
            openTime: false
        }
    }

    async componentDidMount() {
        // assume we are signed in as user. retrieve tasks and appointments
        await this.props.fetchUser();
            if(!this.props.auth || !this.props.auth.user) {
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

    async onAddTaskClick() {
        let deadline = this.state.dueDate.format('MM-DD-YYYY') + ' ' + this.state.dueTime;
        await this.props.addTask(this.state.name.trim(), this.state.description, deadline);
        this.props.history.push(baseURL + '/dashboard');
        this.props.history.goForward();
    }

    addTaskFormRender() {
        return (
            <Form>
                <Form.Field>
                    <label>Name</label>
                    <input 
                        value={this.state.name}
                        onChange={e => {
                        this.setState({
                            name: e.target.value
                        });
                    }} />
                </Form.Field>
                <Form.Field>
                    <label>Description</label>
                    <textarea
                        value={this.state.description} 
                        onChange={e => {
                        this.setState({
                            description: e.target.value
                        });
                    }} />
                </Form.Field>
                <Form.Field>
                    <label>Due Date</label>
                    <DatePicker
                        selected={this.state.dueDate}
                        onChange={date => {
                            this.setState({dueDate: date})
                        }}
                    />
                    
                </Form.Field>               
                <Form.Field>
                    <label>Due Time</label>
                    <DatePicker
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={15}
                        timeFormat="HH:mm"
                        timeCaption="time"
                        value={this.state.dueTime}
                        onChange={time => {
                            this.setState({
                                dueTime: time.format("HH:mm")
                            });
                        }} />
                </Form.Field>
                <Button onClick={this.onAddTaskClick.bind(this)}>
                    Add Task
                </Button>
            </Form>
        )
    }

    render() {
        return (
            <Container className="add-task">
                <h3>Add Task</h3>
                {this.addTaskFormRender()}
            </Container>
        )
    }
}

function mapStateToProps({ auth }) {
    return { auth };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        addTask: addTask,
        fetchUser: fetchUser
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(AddTaskPage);