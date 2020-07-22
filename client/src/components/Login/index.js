<<<<<<< HEAD
import React, { useState } from 'react'
import { Col, Row, CardPanel ,TextInput } from 'react-materialize'
import Submit from './Submit'
import FrontMessage from '../Login/FrontMessage'
const Login = () => {

  const [data, setData] = useState({})
  const [message, setMessage] = useState('Enter your Credentials')
  const inputHandler = (e) => {
=======
import React , {useState, useEffect} from 'react'  
import { Col, Row, CardPanel} from 'react-materialize'
import Field from './Field'
import Submit from './Submit'
import FrontMessage from '../Login/FrontMessage'
const Login = () => {
  const [data,setData] = useState({})
  const [message,setMessage] = useState('Enter your Credentials')
  const inputHandler = (e) => {   
>>>>>>> master
    const newData = {}
    newData[e.target.id] = e.target.value
    setData(prevData => {
<<<<<<< HEAD
      return { ...prevData, ...newData } //insereaza array-ul newData[Pass],newData[Email] in data => {Email: ... , Password: ....}
    })


  }

  // useEffect(() => {
  //   document.body.style.backgroundImage = "url(/purpleForest.jpg)"
  // }, [])
=======
      return {...prevData,...newData} //insereaza array-ul newData[Pass],newData[Email] in data => {Email: ... , Password: ....}
    } )
  } 
>>>>>>> master

  useEffect(() => {
    document.body.style.backgroundImage = "url(/purpleForest.jpg)"
  }, [])

  return (
<<<<<<< HEAD
    <Row >
      <Col className="center-align">
        <FrontMessage message={message} />
        <CardPanel className="col s4 green lighten-5 roundBorder">
          <TextInput icon="person" placeholder="Email/Username" id="Email" className="validate" onChange={inputHandler} />
          <TextInput icon="lock" placeholder="Password" id="Password" className="validate" onChange={inputHandler} type="password" />
        </CardPanel>
        <Submit data={data} setMessage={setMessage} />
      </Col>
    </Row>
=======
  <Row >
    <Col className="col s12 center-align">
    <FrontMessage message={message}/> 
      <CardPanel className="green lighten-5 col s4 m2">  
        <Field placeholder="Email/Username" type="email" id="Email" inputHandler={inputHandler}/>
        <Field placeholder="Password" type="password" id="Password"  inputHandler={inputHandler} />
     </CardPanel>
     <Submit data={data} setMessage={setMessage}/>
    </Col>
  </Row>
>>>>>>> master
  )
}

export default Login