import React, { useState, useEffect } from 'react'
import { Route, Switch } from 'react-router-dom'
import axios from 'axios'
import './App.css'

import Topnav from './Topnav'
import HomeLogged from './HomeLogged'
import HomeNotLogged from './HomeNotLogged'
import Login from './Login' 
import Register from './Register'
import ErrorPage from './ErrorPage'
import Forgot from './Forgot'

const App = () => {
  const [user, setUser] = useState()
  
  useEffect(() => {
    axios.post('/api/checkToken')
         .then( ({data}) => data.error? setUser(null) : setUser(data))
         .catch( (error) => console.log('Error checking cookies') ) 
  }, [])

  const Home = user? HomeLogged : HomeNotLogged
    
  return (
    <>
      <Topnav user={user}/>
      <Switch>
        <Route exact path='/' component={Home} />
        <Route path='/login' component={Login} />
        <Route path='/register' component={Register} />
        <Route path='/error' component={ErrorPage} />
        <Route path='/forgot' component={Forgot} />
      </Switch>
    </>
  )
}

export default App;