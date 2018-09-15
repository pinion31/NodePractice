import React, {Component} from 'React';
import {Switch} from 'react-router-dom';
import {Route} from 'react-router';
import Login from './Login';

const RoutedApp = () => (
  <div>
    <Switch>
      <Route path="/login" component={Login} />
    </Switch>
  </div>
);

export default RoutedApp;