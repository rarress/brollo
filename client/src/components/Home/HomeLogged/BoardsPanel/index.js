import React from 'react'
import { Preloader } from 'react-materialize'
import { v4 as uuidv4 } from 'uuid'
import TeamBoards from './TeamBoards'
import Popup from './PopupBoards'
import './boards.css'

const BoardsPanel = ({ boards, teams, refreshData }) => {
    const renderBoards = () => {
        //Wait for data to be fetched
        if (!boards || !teams)
            return <Preloader active />

        //Avoid errors if no boards exist
        if (boards.length === 0)
            return <div>You have no boards!</div> 
        
        //Create a team panel for every team
        return teams.map((team) =>
            <TeamBoards key={uuidv4()} team={team} boards={boards} />
        )
    }

    return (
        <div className='panel bigsize'>
            <h5>Boards</h5>
            <Popup teams={teams} refreshData={refreshData}/>
            {renderBoards()}
        </div>
    )
}

export default BoardsPanel