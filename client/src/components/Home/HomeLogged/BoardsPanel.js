import React, {useState, useEffect}from 'react'
import useData from './useData'
import { Preloader, CardPanel } from 'react-materialize'
import TeamPanel from './TeamPanel' 
import { v4 as uuidv4 } from 'uuid'

const Boards = ({user}) => {
    const [isLoading, response] = useData(`/api/boards/find?User=${user.Username}`)
    const [boards, setBoards] = useState({})

    useEffect(() => {
        if (response && response.success === true) {
            const data = response.data
            let newBoards = {}  
            //Group by teams 
            //Explination: [...data] becomes {Team1: [...data that contains Team1], Team2: [...data that contains Team2], ...}
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
        return Object.keys(boards).map( (name) => 
            <TeamPanel key={uuidv4()} name={name} boards={boards[name]}/>
        )
    }

    return (
        <CardPanel className='size6'> 
            <h5>Boards</h5>
            {renderBoards()}
        </CardPanel>
    )
}

export default Boards