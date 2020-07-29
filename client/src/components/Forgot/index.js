import React, { useState, useEffect } from 'react'
import { Col, Row, CardPanel, TextInput } from 'react-materialize'
import Submit from './Submit'
const Forgot = () => {


    useEffect(() => {
        document.body.style.backgroundImage = "url(/purpleForest.jpg)"
      }, [])

    return (
        <Row className="center-align">
         <Col className="col s6">
        <h1 className="specialTextColor">Forgot password</h1>
             <CardPanel className="green lighten-5 roundBorder">  
            <TextInput icon="person" placeholder="Enter your Email" id="Email" className="validate" />
            <Submit />
          </CardPanel>
        </Col>
        
      </Row>
    )
}


export default Forgot