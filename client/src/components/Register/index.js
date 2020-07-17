import React, {useState} from 'react'  
import { Col, Row, CardPanel} from 'react-materialize'
import ErrorMessage from './ErrorMessage'
import Field from './Field'
import Submit from './Submit'

const Register = () => {
  const [data, setData] = useState({}) 
  const [error, setError] = useState("")

  const txtInputHndler = (e) => {   
    const new_data = {}
    new_data[e.target.placeholder] = e.target.value
    setData(prev => { return {...prev, ...new_data} } )
  } 

  return ( 
  <Row>
    <Col className="col s6 offset-s3 responsive">
      <h1 className="center-align"> Register </h1>
      <CardPanel className="green lighten-5">  
        <ErrorMessage error={error}/>
        <Field placeholder="First Name" txtInputHndler={txtInputHndler}/> 
        <Field placeholder="Last Name" txtInputHndler={txtInputHndler}/> 
        <Field placeholder="Email" email={true} txtInputHndler={txtInputHndler}/>    
        <Field placeholder="Username" txtInputHndler={txtInputHndler}/>     
        <Field placeholder="Password" password={true} txtInputHndler={txtInputHndler}/>     
        <Field placeholder="Confirm Password" password={true} txtInputHndler={txtInputHndler}/>   
        <Submit data={data} setError={setError}/>
      </CardPanel>  
    </Col>
  </Row> 
  )
}

export default Register