import React, { useState } from 'react'
import { Icon, Button, CardPanel } from 'react-materialize'
import axios from 'axios'
export default function VerifyUser({ data, setMessage }) {
  const [cardStyle,setStyle] = useState({display:"block"})
  const sendMail = (e) => {
    setStyle({display:"none"})
    console.log(data.Email)
    axios.post('/api/verifyUser/resend', { Email: data.Email }).then(response => console.log(response.data)).catch(err => console.log(err))

    setMessage("Another link has been sent.Check your email address")
  }


  return (
    <CardPanel style={cardStyle} className="green lighten-5 roundBorder">
      <p>If you want to recive another verification link, click the button below and check your email address</p>
      <Button node="button" type="submit" waves="light" onClick={sendMail}>Send
        <Icon right>
          replay
        </Icon>
      </Button>
    </CardPanel>
  )
}