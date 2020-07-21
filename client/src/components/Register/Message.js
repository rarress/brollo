import React from 'react'  
import { v4 as uuidv4 } from 'uuid'
import {Row, Preloader} from 'react-materialize'

const ErrorMessage = ({message}) => { 

    let messages = message.split("[ENDLINE]")
    return (
    <Row className="red-text">   
        {
            messages.map( message => 
                <div key={uuidv4()}>
                    <span>
                        {message==="loading"? <Preloader active color="blue" flashing={true}/> : message}
                    </span>
                    <br/>
                </div>
        )}
    </Row> 
    )
  }
  
  export default ErrorMessage
 
