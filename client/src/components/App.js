import React from 'react'
import { Route, Switch } from 'react-router-dom'
import './App.css'

import Topnav from './Topnav'
import Home from './HomeNotLogged'
import Login from './Login' 
import Register from './Register'
import ErrorPage from './ErrorPage'

const App = () => { 
  return (
  <>  
    <Topnav/>
    <Switch>
      <Route exact path='/' component={Home}/>
      <Route path='/login' component={Login}/>
      <Route path='/register' component={Register}/>
      <Route path='/error' component={ErrorPage}/>
    </Switch> 
  </>
  )
}

export default App;