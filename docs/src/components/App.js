import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import Landing from './Landing';
import Register from './Register';
import AppHeader from './AppHeader';

import './App.css';

var baseUrl = '/schedule-hero';

class App extends Component {
  render() {
    return (
      <div>
        <BrowserRouter>
          <div>
            <AppHeader />
            <div className="container">
              <Route exact path={baseUrl} component={Landing} />
              <Route exact path={baseUrl + '/register'} component={Register} />
            </div>
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
