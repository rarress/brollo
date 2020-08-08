import React, {useState, useEffect}from 'react'
import useData from '../useData'
import { Preloader } from 'react-materialize'
import TeamBoards from './TeamBoards' 
import { v4 as uuidv4 } from 'uuid'

const BoardsPanel = ({user}) => {
    const [isLoading, response] = useData(`/api/boards/find?User=${user.Username}`)
    const [boards, setBoards] = useState({})

    useEffect(() => {
        if (response && response.success === true) {
            const data = response.data
            let newBoards = {}  
            //Group by teams 
            //Explanation: [...data] becomes {Team1: [...data that contains Team1], Team2: [...data that contains Team2], ...}
            data.map( ({ Team, ...data }) => newBoards[Team]? newBoards[Team].push(data) : newBoards[Team] = [data] )  
            setBoards(newBoards)
        }
    }, [response])
  
    const renderBoards = () => {
        //Wait for data to be fetched
        if (isLoading)
            return <Preloader active/> 

        //Avoid errors if no boards exist
        if (Object.keys(boards).length === 0)
            return <div>You have no boards!</div>

        //Create a team panel for every team
        return Object.keys(boards).map( (team) => 
            <TeamBoards key={uuidv4()} name={team} boards={boards[team]}/>
        )
    }

    return (
        <div className='panel size4'> 
            <h5>Boards</h5>
            {renderBoards()}
        </div>
    )
}

export default BoardsPanel