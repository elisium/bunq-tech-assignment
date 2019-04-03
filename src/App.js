import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from "react-router-dom";

import Login from './components/Login';
import Conversations from './components/Conversations';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <Switch>
              <Route exact path="/" component={Login} />
              <Route path="/conversations" component={Conversations} />
          </Switch>
       </div>
      </BrowserRouter>
    );
  }
}

export default App;
