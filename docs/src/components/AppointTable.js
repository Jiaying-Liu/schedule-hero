import React, { Component } from 'react';
import {
    Table
} from 'semantic-ui-react';
import moment from 'moment';
import { isDueWithinWeek } from '../helpers/timeHelper';

class AppointTable extends Component {
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
                    <Table.HeaderCell>
                        Edit/Delete
                    </Table.HeaderCell>
                </Table.Row>
            </Table.Header>
        )
    }

    getAppointsDueInWeek() {
        var today = new Date();
        return this.props.appointments.filter(appoint => {
            let startDate = new Date(appoint.start.split(' ')[0]);

            return isDueWithinWeek(startDate, today);
        });
    }

    appointTableBodyRender() {
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

    render() {
        return(
            <Table celled>
                {this.appointTableHeaderRender()}
                {this.appointTableBodyRender()}
            </Table>
        );
    }
}

export default AppointTable;