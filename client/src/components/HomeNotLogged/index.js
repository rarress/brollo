import React, {useState, useEffect} from 'react' 
import {Row} from 'react-materialize'
import Showcase from './Showcase'

const Home = ({isLoggedIn}) => { 
  const [message, setMessage] = useState()
  isLoggedIn = true

  useEffect(() => {
    document.body.style.backgroundImage = "url(purpleForest.jpg)"
  }, [])

  return (
  <>
    { message? <Row>{message}</Row> : null }
    { isLoggedIn? <Showcase/> : null }
  </>
  ); 
}
 
export default Home