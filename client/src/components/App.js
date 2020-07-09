import React from 'react'
import { Route, Switch } from 'react-router-dom'
import './App.css'

import Topnav from './Topnav'
import Home from './Home'
import Login from './Login' 
import Register from './Register'

const App = () => { 
  return (
  <>  
    <Topnav/>
    <Switch>
      <Route exact path='/' component={Home}/>
      <Route path='/login' component={Login}/>
      <Route path='/register' component={Register}/>
    </Switch>
  </>
  )
}

export default App;