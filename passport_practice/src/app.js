import React from 'react';
import ReactDOM from 'react-dom';
import RoutedApp from './components/RoutedApp';
import Login from './components/Login';
//import '../sass/style.scss';


ReactDOM.render(
  <RoutedApp />,
  document.getElementById('app'),
);

if (module.hot) {
  module.hot.accept();
}