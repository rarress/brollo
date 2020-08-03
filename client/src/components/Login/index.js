import React , {useState, useEffect} from 'react'  
import {Link} from "react-router-dom"
import { Col, Row, CardPanel, TextInput} from 'react-materialize'
import Submit from './Submit'
import FrontMessage from '../Login/FrontMessage'
const Login = ({connectUser}) => {
  const [data,setData] = useState({})
  const [message,setMessage] = useState('Enter your Credentials')
  const inputHandler = (e) => {   
    const newData = {}
    newData[e.target.id] = e.target.value
    setData(prevData => {
      return {...prevData,...newData} //insereaza array-ul newData[Pass],newData[Email] in data => {Email: ... , Password: ....}
    } )
  } 

  useEffect(() => {
    document.body.style.backgroundImage = "url(/purpleForest.jpg)"
  }, [])

  return (
    <Row className="center-align">
      <Col className="col s5">
        <FrontMessage message={message} />
        <CardPanel className="green lighten-5 roundBorder">
          <TextInput icon="person" placeholder="Email/Username" id="Email" className="validate" onChange={inputHandler} />
          <TextInput icon="lock" placeholder="Password" id="Password" className="validate" onChange={inputHandler} type="password" />
          <Submit data={data} connectUser={connectUser} setMessage={setMessage} />
          <Link className="forgot-pass" to="/forgot">Forgot password</Link>
        </CardPanel>
      </Col>
  
    </Row>
  )
}

export default Login