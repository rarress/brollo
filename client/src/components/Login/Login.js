import React from 'react'
import { Link } from 'react-router-dom'

const Login = () => {
  return (
  <div >
    login
    <Link to={'./'}>
      <button variant="raised">
          Go back
      </button>
    </Link>
  </div>
  )
}

export default Login