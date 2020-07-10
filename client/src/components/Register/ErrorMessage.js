import React from 'react'  
import { v4 as uuidv4 } from 'uuid'
import {Row} from 'react-materialize'

const ErrorMessage = ({error}) => { 

    let messages = error.split("[ENDLINE]")
    return (
    <Row className="red-text">   
        {
            messages.map( message => 
                <div key={uuidv4()}>
                    <span>
                        {message}
                    </span>
                    <br/>
                </div>
        )}
    </Row> 
    )
  }
  
  export default ErrorMessage;