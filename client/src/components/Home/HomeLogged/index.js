import React, {useEffect} from 'react' 
import BoardsPanel from './BoardsPanel/index.js'
import './homeLogged.css'

const Home = ({user}) => { 
  
  useEffect(() => {
    document.body.style.backgroundImage = "" 
  }, [])

  return (  
    <div className="center"> 
      <div className="homeContainer">  
          <div className='panel'>
            Teams 
          </div>
          <BoardsPanel user={user}/>
      </div> 
    </div>
  ); 
}

export default Home