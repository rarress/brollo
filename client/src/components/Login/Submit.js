import React from 'react'
import { Button, Icon } from 'react-materialize'
import axios from 'axios'
import { useHistory } from "react-router-dom"

export default function Submit({ data, setMessage, connectUser,setVerify }) {

  const history = useHistory()
  const submitData = (e) => {

    if (!data.Email) {
      setMessage("Enter your Email or Username")
      return
    }

    if (!data.Password) {
      setMessage("Enter your Password")
      return
    }

    axios.post('/api/login', {
      Email: data.Email,
      Password: data.Password
    })
      .then(function (response) {
        console.log(response.data)
        if (response.data.success) {
          if (response.data.Verified) {
            connectUser()
            history.push('/')
          } else {
            setVerify(false)
          }
        }
        setMessage(response.data.message)
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  return (
    <>
      <Button
        node="button"
        type="submit"
        waves="light"
        onClick={submitData}
      >

        Submit
        <Icon right>
          send
        </Icon>
      </Button>
    </>
  )
}
