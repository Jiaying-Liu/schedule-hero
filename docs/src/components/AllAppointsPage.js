import React, { Component } from 'react';
import {
    Container
} from 'semantic-ui-react';
import AppointTable from './AppointTable';
import DeleteAppointModal from './DeleteAppointModal';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    fetchUser,
    fetchAppointments,
    deleteAppointment
} from '../actions/index';
import { baseURL } from '../helpers/baseURL';

class AllAppointsPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showDeleteAppoint: false,
            appointToDelete: null
        };
    }

    async componentDidMount() {
        await this.props.fetchUser();
            if(this.props.auth && this.props.auth.user) {
                this.props.fetchAppointments();
            } else {
                this.props.history.push(baseURL);
                this.props.history.goForward();
            }
    }

    onDeleteAppointIconClick(appoint) {
        this.setState({
            showDeleteAppoint: true,
            appointToDelete: appoint
        });
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

    async onDeleteAppoint(id) {
        await this.props.deleteAppointment(id);
        this.props.fetchAppointments();
        this.setState({
            showDeleteAppoint: false,
            appointToDelete: null
        });
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
                    onDeleteAppoint={this.onDeleteAppointIconClick.bind(this)} />
                {this.confirmDeleteAppointModalRender()}
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
