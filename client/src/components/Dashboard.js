import React, { Component } from 'react';
import {
    Container
} from 'semantic-ui-react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchUser } from '../actions/index';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';

import './Dashboard.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';

class Dashboard extends Component {
    constructor(props) {
        super(props);
        BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment));
    }

    componentDidMount() {
        this.props.fetchUser();
    }

    render() {
        if(!this.props.auth || !this.props.auth.user) {
            return <div>Session timed out.</div>
        }

        return (
            <div>
                <h1 style={{'textAlign': 'center'}}>Welcome {this.props.auth.user.name}!</h1>
                <div className='schedule-hero-calendar'>
                    <BigCalendar
                        events={[]}
                        startAccessor='startDate'
                        endAccessor='endDate' />
                </div>
            </div>
        )
    }
}

function mapStateToProps({ auth }) {
    return { auth };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        fetchUser: fetchUser
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);