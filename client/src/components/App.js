import React, { useState, useEffect } from 'react'
import { Route, Switch } from 'react-router-dom'
import axios from 'axios'
import './App.css'

import Topnav from './Topnav'
import Home from './Home'
import Login from './Login' 
import Register from './Register'
import ErrorPage from './ErrorPage'
import Forgot from './Forgot'
import changePass from './Forgot/changePass'

const App = () => {
  const [user, setUser] = useState(null)

  const connectUser = () => {
    axios.post('/api/checkToken')
         .then( ({data}) => data.error? setUser(null) : setUser(data))
         .catch( (error) => console.log('Error checking cookies') ) 
  }
  
  useEffect(() => {
    connectUser()
  }, []) 
    
  return (
    <>
      <Topnav user={user}/>
      <Switch>
        <Route exact path='/' render={() => <Home user={user}/>} />
        <Route path='/login' render={() => <Login connectUser={connectUser}/>}/>
        <Route path='/register' component={Register} />
        <Route path='/error' component={ErrorPage} />
        <Route path='/forgot/:token' component={changePass} />
        <Route path='/forgot' component={Forgot} />

      </Switch>
    </>
  )
}

export default App;