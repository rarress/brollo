import React,{useState} from 'react'  
import { Col, Row, CardPanel} from 'react-materialize'
import Field from './Field'
import Submit from './Submit'
import FrontMessage from '../Login/FrontMessage'
const Login = () => {

  const [data,setData] = useState({})
  const [message,setMessage] = useState('Enter your Credentials')
  const inputHandler = (e) => {   
    const newData = {}
    newData[e.target.placeholder] = e.target.value 
    setData(prevData => {
      return {...prevData,...newData} //insereaza array-ul newData[Pass],newData[Email] in data => {Email: ... , Password: ....}
    } )

  
  } 

  return (
  <Row >
    <Col className="col s12 responsive center-align">
    <FrontMessage message={message}/> 
      <CardPanel className="green lighten-5 col s2 ">  
        <Field placeholder="Email" type="email" inputHandler={inputHandler}/>
        <Field placeholder="Password" type="password"  inputHandler={inputHandler} />
        
     </CardPanel>
     <Submit data={data} setMessage={setMessage}/>
    </Col>
 
  </Row>
  )
}

export default Login