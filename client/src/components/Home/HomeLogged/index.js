import React, {useEffect} from 'react' 
import BoardsPanel from './BoardsPanel/index.js'
import TeamsPanel from './TeamsPanel/index.js'
import './homeLogged.css'

const Home = ({user}) => { 
  
  useEffect(() => {
    document.body.style.backgroundImage = "" 
  }, [])

  return (  
    <div className="center"> 
      <div className="homeContainer">  
          <TeamsPanel user={user}/>
          <BoardsPanel user={user}/>
      </div> 
    </div>
  ); 
}

export default Home