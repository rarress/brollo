import React, { useState, useEffect } from 'react'
import { Col, Row, CardPanel, TextInput, Button, Icon } from 'react-materialize'
import axios from 'axios'
const Forgot = () => {
  const [data, setData] = useState({})
  const [message, setMessage] = useState("Forgot password")
  const inputHandler = (e) => {
    const newData = {}
    newData["Email"] = e.target.value
    setData(newData)
  }

  useEffect(() => {
    document.body.style.backgroundImage = "url(/purpleForest.jpg)"
  }, [])

  const onSubmit = (e) => {

    axios.post('/api/forgotPassword', data).then(response => {
      if (response.data.success) {
        setMessage("Email Sent")
      } else {
        setMessage("Wrong Email or Username")
      }
    }).catch(err => console.log(err))

  }
  return (
    <Row className="center-align">
      <Col className="col s6 ">
        <h1 className="specialTextColor ">{message}</h1>
        {message.includes("Forgot") || message.includes("Wrong") ?
          <CardPanel className="green lighten-5 roundBorder">
            <TextInput icon="person" placeholder="Enter your Email or Username" id="Email" className="validate" onChange={inputHandler} />
            <Button node="button" type="submit" waves="light" onClick={onSubmit}>
              Submit <Icon right>send</Icon>
            </Button>
          </CardPanel>
          : null}
      </Col>
    </Row>
  )
}


export default Forgot