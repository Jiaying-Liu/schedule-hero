import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import Landing from './Landing';
import Register from './Register';
import AppHeader from './AppHeader';
import AddTaskPage from './AddTaskPage';
import AddAppointPage from './AddAppointPage';
import AllTasksPage from './AllTasksPage';
import AllAppointsPage from './AllAppointsPage';
import { baseURL } from '../helpers/baseURL';

import './App.css';
import 'react-datepicker/dist/react-datepicker.css';
import 'font-awesome/css/font-awesome.min.css';
import Dashboard from './Dashboard';

class App extends Component {
  render() {
    return (
      <div>
        <BrowserRouter>
          <div>
            <AppHeader />
            <div>
              <Route exact path={baseURL} component={Landing} />
              <Route exact path={baseURL + '/register'} component={Register} />
              <Route exact path={baseURL + '/dashboard'} component={Dashboard} />
              <Route exact path={baseURL + '/add-task'} component={AddTaskPage} />
              <Route exact path={baseURL + '/add-appointment'} component={AddAppointPage} />
              <Route exact path={baseURL + '/all-tasks'} component={AllTasksPage} />
              <Route exact path={baseURL + '/all-appointments'} component={AllAppointsPage} />
            </div>
          </div>
        </BrowserRouter>
      </div>
    );
  }
} 

export default App;
