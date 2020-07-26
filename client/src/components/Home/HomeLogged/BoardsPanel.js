import React, {useState, useEffect}from 'react'
import useData from './useData'
import { Preloader, CardPanel } from 'react-materialize'
import TeamPanel from './TeamPanel' 
import { v4 as uuidv4 } from 'uuid'

const Boards = ({user}) => {
    const [isLoading, response] = useData(`/api/boards/find?User=${user.Username}`)
    const [teamsBoards, setTeamsBoards] = useState({})

    useEffect(() => {
        if (response && response.success === true) {
            //TODO BEAUTIFY THIS
            const teamSorted = response.data.sort( (a, b) => a.Team > b.Team)
            const newTeamsBoards = {} // {TeamA : [], TeamB : []}
            for (let t of teamSorted){
                if (newTeamsBoards[t["Team"]] === undefined)
                    newTeamsBoards[t["Team"]] = [t]
                else newTeamsBoards[t["Team"]].push(t)
            }
            setTeamsBoards(newTeamsBoards)
        }
    }, [response])
  
    return (
        <CardPanel className='size6'> 
            <h5>Boards</h5>
            {
                isLoading? 
                <Preloader active/> 
                :   
                Object.keys(teamsBoards).length === 0 ?
                    <div>You have no boards!</div>
                    :
                    Object.keys(teamsBoards).map( (name) => 
                        <TeamPanel key={uuidv4()} name={name} boards={teamsBoards[name]}/>
                    )
            }
        </CardPanel>
    )
}

export default Boards