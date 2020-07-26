import React from 'react' 
import { v4 as uuidv4 } from 'uuid'
import { Row, Col, TextInput} from 'react-materialize'

const Field = ({placeholder, txtInputHndler, email, password}) => { 
  const iconMap = {
    "First Name" : "person_outline",
    "Last Name" : "person_outline",
    "Username" : "person",
    "Email" : "email",
    "Password" : "lock",
    "Confirm Password" : "lock",
  }
  return(
    <Row>
      <Col className="col s9">
          <TextInput
            placeholder={placeholder} id={placeholder}
            email={email} password={password} 
            icon={iconMap[placeholder]} 
            onChange={txtInputHndler}/> 
      </Col>
    </Row>
  )
}

export default Field