import React from 'react'
import { Preloader } from 'react-materialize'
import { v4 as uuidv4 } from 'uuid'
import Popup from './PopupTeams'
import './teams.css'

const TeamsPanel = ({ teams, refreshData }) => { 
    const renderTeams = () => {
        //Wait for data to be fetched
        if (!teams)
            return <Preloader active />

        if (teams.length === 0)
            return <div>No teams :(</div>
 
        //Create a team panel for every team
        return teams.map((team) => 
            team?
            <div key={uuidv4()} className="team">
                {team}
            </div>
            : null 
        )
    }

    return (
        <div className='panel teamsPanel'>
            <h5>Teams:</h5>
            <Popup refreshData={refreshData}/>
            <div className="teams">
                {renderTeams()}
            </div>
        </div>
    )
}

export default TeamsPanel
