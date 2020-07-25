import React, { useState, useEffect } from 'react'
import { Route, Switch } from 'react-router-dom'
import axios from 'axios'
import './App.css'

import Topnav from './Topnav'
import HomeNotLogged from './HomeNotLogged'
import Home from './HomeWhenLogged'
import Login from './Login' 
import Register from './Register'
import ErrorPage from './ErrorPage'

const App = () => {
  const [user, setUser] = useState({})
  useEffect(() => {
    axios.post('/api/checkToken').then(function (response) {
      let userData = response.data
      if (!userData.error)
        setUser(userData)
    }).catch(function (error) {
      console.log('Error checking cookies');
    })
  }, []);
  
  return (
    <>
      <Topnav />
      <Switch>
        {Object.keys(user).length !== 0 ? <Route exact path='/' component={Home} /> : <Route exact path='/' component={HomeNotLogged} /> } 
        <Route path='/login' component={Login} />
        <Route path='/register' component={Register} />
        <Route path='/error' component={ErrorPage} />
      </Switch>
    </>
  )
}

export default App;