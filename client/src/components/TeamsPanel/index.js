import React, { useState, useEffect } from 'react'
import useData from '../useData'
import { Preloader, Button, Icon } from 'react-materialize'
import { v4 as uuidv4 } from 'uuid'
import Popup from './PopupTeams'
import './teams.css'

const TeamsPanel = ({ user }) => {
    const [isLoading, response] = useData(`/api/teams?User=${user.Username}`)
    const [teams, setTeams] = useState([])
    const [hidePopup, setHidePopup] = useState(true) 

    useEffect(() => {
        if (response && response.success === true) {
            const data = response.data 
            setTeams(data)
        }
    }, [response])

    const renderTeams = () => {
        //Wait for data to be fetched
        if (isLoading)
            return <Preloader active />

        //Create a team panel for every team
        return teams.map((team) =>
            <div key={uuidv4()} className="teamspanel">
                {team.Name}
            </div>
        )
    } 
    
    const togglePopup = () => {
        setHidePopup(prev => prev === true ? false : true)
    }

    return (
        <div className='panel teamsPanel'>
            <Popup togglePopup={togglePopup} hidePopup={hidePopup}/>
            <h5>Teams:</h5> 
            <div style={{marginBottom: "2rem"}}>
                <Button className="pink lighten-3 left" floating icon={<Icon>add</Icon>} tooltip="Create new team" onClick={togglePopup}/> 
            </div>
            {renderTeams()} 
        </div>
    )
}

export default TeamsPanel
