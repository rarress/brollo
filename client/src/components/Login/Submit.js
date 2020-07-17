import React from 'react'
import { Button } from 'react-materialize'
export default function Submit({ data, setMessage }) {

  const submitData = (e) => {

    if (!data.Email) {
      setMessage("Enter your Email")
      return
    }

    if( !data.Password){
      setMessage("Enter your Password")
      return
      }

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
