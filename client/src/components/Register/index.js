import React, {useState, useEffect} from 'react'  
import { Col, Row, CardPanel} from 'react-materialize'
import Message from './Message'
import Field from './Field'
import Submit from './Submit'

const Register = () => {
  const [data, setData] = useState({}) 
  const [message, setMessage] = useState("")

  useEffect(() => {
    document.body.style.backgroundImage = "url(/purpleForest.jpg)"
  }, [])

  const txtInputHndler = (e) => {   
    const new_data = {}
    new_data[e.target.placeholder] = e.target.value
    setData(prev => { return {...prev, ...new_data} } )
  } 
  
  return ( 
  <Row>
    <Col className="col s6 center-align">
      <h1 className="specialTextColor"> Register </h1>
      <CardPanel className="green lighten-5 roundBorder">  
        <Message message={message}/>
        <Field placeholder="First Name" txtInputHndler={txtInputHndler}/> 
        <Field placeholder="Last Name" txtInputHndler={txtInputHndler}/> 
        <Field placeholder="Email" email={true} txtInputHndler={txtInputHndler}/>    
        <Field placeholder="Username" txtInputHndler={txtInputHndler}/>     
        <Field placeholder="Password" password={true} txtInputHndler={txtInputHndler}/>     
        <Field placeholder="Confirm Password" password={true} txtInputHndler={txtInputHndler}/> 
        <Submit data={data} setMessage={setMessage}/>  
      </CardPanel>
    </Col>
  </Row> 
  )
}

export default Register