import React, {useState} from 'react' 
import {Row} from 'react-materialize'
import Showcase from './Showcase'

const Home = ({isLoggedIn}) => { 
  const [message, setMessage] = useState()
  isLoggedIn = true
  return (
  <>
    { message? <Row>{message}</Row> : null }
    {
      isLoggedIn? 
      <Showcase/>
      :
      null
    }
  </>
  ); 
}
 
export default Home