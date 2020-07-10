import React from 'react' 
import { v4 as uuidv4 } from 'uuid'
import { Row, Col, TextInput} from 'react-materialize'

const Field = ({placeholder, txtInputHndler, email, password}) => { 
    return(
      <Row>
        <Col className="col s9">
            <TextInput key={uuidv4} placeholder={placeholder} email={email} password={password} id={`${placeholder}`} onChange={txtInputHndler}/> 
        </Col>
      </Row>
    )
}

export default Field