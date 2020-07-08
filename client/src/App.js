import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import './App.css';
import Home from './routes/Home';
import Test from './routes/Test';

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