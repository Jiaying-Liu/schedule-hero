import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import Landing from './Landing'
import AppHeader from './AppHeader';

import './App.css';

class App extends Component {
  render() {
    return (
      <div>
        <BrowserRouter>
          <div>
            <AppHeader />
            <div className="container">
              <Route exact path='/' component={Landing} />
            </div>
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
