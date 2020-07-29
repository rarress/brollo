import React from 'react'
import { Button } from 'react-materialize'
import axios from 'axios'
import { useHistory } from "react-router-dom"

export default function Submit({ data, setMessage, connectUser}) {

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
          setMessage(response.data.message)
    
          if(response.data.success){
            connectUser()
            history.push('/')
          }
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
      </Button>

    </>
  )
}
