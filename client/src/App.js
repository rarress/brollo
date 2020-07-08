import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Test from './pages/Test';

class App extends Component {
  render() { 
    return (
      <Switch>
        <Route exact path='/' component={Home}/>
        <Route path='/test' component={Test}/>
      </Switch>
    );
  }
}

export default App;