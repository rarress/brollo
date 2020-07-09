import React, {useState} from 'react' 
import { Col, Row, CardPanel, TextInput, Button, Icon} from 'react-materialize'

const Register = () => {
  const [data, setData] = useState({}) 
  
  const onSubmit = () => {
    const requiredField = ["First Name", "Last Name", "Email", "Username", "Password", "Confirm password"]
    const keys = Object.keys(data)
 
    // Check if all field are present
    for (let i in requiredField)
      if (!keys.includes(requiredField[i]))
        return
          
    // Check if valid email
    if (!data["Email"].includes("@"))
      return

    const upperChar = /[A-Z]/g
    const lowerChar = /[a-z]/g
    const digit = /[0-9]/g 
    const minLength = 8
    if (!data["Password"].match(upperChar))
      return
    if (!data["Password"].match(lowerChar))
      return
    if (!data["Password"].match(digit))
      return
    if (data["Password"].length < minLength)
      return

    // Check if password are the same
    if (data["Password"] !== data["Confirm password"])
      return

    console.log("all done")
      //toodo trimite datele la server+update la pagina
  }

  const textInputHandler = (e) => {  
    const new_data = {}
    new_data[e.target.placeholder] = e.target.value
    setData(prev => { return {...prev, ...new_data} } )
  }

  return ( 
  <Row>
    <Col className="col s6 offset-s3">
      <h1 className="center-align"> Register </h1>
      <CardPanel className="green lighten-5"> 
        <Row>
          <TextInput placeholder="First Name" id="TextInput-4" onChange={textInputHandler}/> 
          <TextInput placeholder="Last Name" id="TextInput-4" onChange={textInputHandler}/> 
        </Row>
        <Row>  
          <TextInput placeholder="Email" email={true} id="TextInput-4" onChange={textInputHandler}/>  
        </Row>
        <Row> 
          <TextInput placeholder="Username" id="TextInput-4" onChange={textInputHandler}/> 
        </Row> 
        <Row> 
          <TextInput placeholder="Password" password={true} id="TextInput-4" onChange={textInputHandler}/> 
          <TextInput placeholder="Confirm password" password={true} id="TextInput-4" onChange={textInputHandler}/> 
        </Row>
        <Button onClick={onSubmit} node="button" type="submit" waves="light" >
          Submit
          <Icon right>
            send
          </Icon>
        </Button>
      </CardPanel>  
    </Col>
  </Row> 
  )
}

export default Register