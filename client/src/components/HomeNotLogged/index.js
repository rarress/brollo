import React, {useState, useEffect} from 'react' 
import {Row} from 'react-materialize'
import Showcase from './Showcase'
import Cookies from 'js-cookie';

const Home = () => { 
  const [message, setMessage] = useState() 

  useEffect(() => {
    document.body.style.backgroundImage = "url(purpleForest.jpg)"
    const newMessage = Cookies.get('HomeNotLogged_message')
    Cookies.remove('HomeNotLogged_message')
    console.log(newMessage)
  }, [])

  return (
  <>
    { message? <Row>{message}</Row> : null }
    <Showcase/>
  </>
  ); 
}
 
export default Home