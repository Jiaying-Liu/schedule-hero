import React, { Component } from 'react';
import {
    Container
} from 'semantic-ui-react';
import AppointTable from './AppointTable';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    fetchUser,
    fetchAppointments,
    deleteAppointment
} from '../actions/index';
import { baseURL } from '../helpers/baseURL';

class AllAppointsPage extends Component {
    async componentDidMount() {
        await this.props.fetchUser();
            if(this.props.auth && this.props.auth.user) {
                this.props.fetchAppointments();
            } else {
                this.props.history.push(baseURL);
                this.props.history.goForward();
            }
    }

    async onDeleteAppoint(id) {
        await this.props.deleteAppointment(id);
        this.props.fetchAppointments();
    }

    render() {
        if(!this.props.appointments || !this.props.appointments.appointments) {
            return null;
        }

        return (
            <Container>
                <h1 style={{textAlign: 'center'}}>All Tasks</h1>
                <AppointTable
                    appointments={this.props.appointments.appointments}
                    onDeleteAppoint={this.onDeleteAppoint.bind(this)} />
            </Container>
        )
    }
}

function mapStateToProps({ auth, appointments }) {
    return { auth, appointments };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        fetchAppointments: fetchAppointments,
        fetchUser: fetchUser,
        deleteAppointment: deleteAppointment
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(AllAppointsPage);
