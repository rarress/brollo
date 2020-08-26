import React, {useState, useEffect} from 'react'
import { Preloader,Button, Icon } from 'react-materialize'
import { v4 as uuidv4 } from 'uuid'
import useData from '../useData'
import TeamBoards from './TeamBoards'  
import Popup from './PopupBoards'
import './boards.css'

const BoardsPanel = ({user}) => {
    const [isLoading, response] = useData(`/api/boards?User=${user.Username}`)
    const [boards, setBoards] = useState({})
    const [hidePopup, setHidePopup] = useState(true) 

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

    const togglePopup = () => {
        setHidePopup(prev => prev === true ? false : true)
    }

    return (
        <div className='panel bigsize'> 
            <Popup togglePopup={togglePopup} hidePopup={hidePopup} boards={boards}/>
            <h5>Boards</h5>
            <div style={{marginBottom: "4rem"}}>
                <Button className="pink lighten-3 left" icon={<Icon>add</Icon>}tooltip="Add new board" onClick={togglePopup}/>
            </div> 
            {renderBoards()} 
        </div>
    )
}

export default BoardsPanel