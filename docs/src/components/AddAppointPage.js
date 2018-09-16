import React, { Component } from 'react';
import {
    Container,
    Form,
    Button
} from 'semantic-ui-react';
import DatePicker from 'react-datepicker';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchUser, addAppointment } from '../actions/index';
import { baseURL } from '../helpers/baseURL';
import moment from 'moment';

import './AddAppointPage.css';

class AddAppointPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: '',
            description: '',
            startDate: moment(),
            startTime: '00:00',
            endDate: moment(),
            endTime: '00:00'
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

    async onAddAppointClick() {
        let start = this.state.startDate.format('MM-DD-YYYY') + ' ' + this.state.startTime;
        let end = this.state.endDate.format('MM-DD-YYYY') + ' ' + this.state.endTime;
        await this.props.addAppointment(this.state.name.trim(), this.state.description, start, end);
        this.props.history.push(baseURL + '/dashboard');
        this.props.history.goForward();
    }

    addAppointFormRender() {
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
                    <label>Start Date</label>
                    <DatePicker
                        selected={this.state.startDate}
                        onChange={date => {
                            this.setState({startDate: date})
                        }}
                    />
                    
                </Form.Field>               
                <Form.Field>
                    <label>Start Time</label>
                    <DatePicker
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={15}
                        timeFormat="HH:mm"
                        timeCaption="time"
                        value={this.state.startTime}
                        onChange={time => {
                            this.setState({
                                startTime: time.format("HH:mm")
                            });
                        }} />
                </Form.Field>
                <Form.Field>
                    <label>End Date</label>
                    <DatePicker
                        selected={this.state.endDate}
                        onChange={date => {
                            this.setState({endDate: date})
                        }}
                    />
                    
                </Form.Field>               
                <Form.Field>
                    <label>End Time</label>
                    <DatePicker
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={15}
                        timeFormat="HH:mm"
                        timeCaption="time"
                        value={this.state.endTime}
                        onChange={time => {
                            this.setState({
                                endTime: time.format("HH:mm")
                            });
                        }} />
                </Form.Field>
                <Button onClick={this.onAddAppointClick.bind(this)}>
                    Add Appointment
                </Button>
            </Form>
        )
    }

    render() {
        return (
            <Container className="add-appoint">
                <h3>Add Appointment</h3>
                {this.addAppointFormRender()}
            </Container>
        )
    }
}

function mapStateToProps({ auth }) {
    return { auth };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        addAppointment: addAppointment,
        fetchUser: fetchUser
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(AddAppointPage);