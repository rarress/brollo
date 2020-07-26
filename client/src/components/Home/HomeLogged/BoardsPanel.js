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
            const sortedData = response.data.sort( (a, b) => a.Team > b.Team)
            const newBoards = {} // {TeamA : [], TeamB : []}
            //Sorting boards by team 
            for (let data of sortedData){ 
                const team = data["Team"]
                if (newBoards[team] === undefined)
                    newBoards[team] = []
                newBoards[team].push(data)
            }
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

        //Create a teampanel for every team
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