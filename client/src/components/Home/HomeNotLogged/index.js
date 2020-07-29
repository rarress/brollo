import React, {useState, useEffect} from 'react' 
import Showcase from './Showcase'
import Cookies from 'js-cookie'

const HomeNotLogged = () => { 
  const [message, setMessage] = useState() 

  useEffect(() => {
    document.body.style.backgroundImage = "url(purpleForest.jpg)" 
    const newMessage = Cookies.get('HomeNotLogged_message')
    Cookies.remove('HomeNotLogged_message')
    setMessage(newMessage)
  }, [])

  return (
  <>
    { message? <h3 className="center-align white-text"> {message} </h3> : null }
    <Showcase/>
  </>
  ); 
}
 
export default HomeNotLogged