import React, {useEffect} from 'react' 
import useData from '../../useData'
import BoardsPanel from './BoardsPanel'
import TeamsPanel from './TeamsPanel'
import './homeLogged.css'

const Home = ({user}) => {  
  const [boards, refreshBoards] = useData(`/api/boards?User=${user.Username}`)
  const [teams, refreshTeams] = useData(`/api/teams?User=${user.Username}`, (data) => [null, ...data.map(team => team.Name)]) 

  useEffect(() => {
    document.body.style.backgroundImage = "" 
  }, [])

  const refreshData = async () => {
    await new Promise(resolve => setTimeout(resolve, 500))
    refreshBoards()
    refreshTeams()
  }

  return (  
    <div className="center"> 
      <div className="homeContainer">  
          <TeamsPanel teams={teams} refreshData={refreshData}/>
          <BoardsPanel boards={boards} teams={teams} refreshData={refreshData}/>
      </div> 
    </div>
  ); 
}

export default Home