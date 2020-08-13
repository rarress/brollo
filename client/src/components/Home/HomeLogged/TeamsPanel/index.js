import React, { useState, useEffect } from 'react'
import useData from '../useData'
import { Preloader, Button } from 'react-materialize'
import { v4 as uuidv4 } from 'uuid'

const TeamsPanel = ({ user }) => {
    const [isLoading, response] = useData(`/api/teams?User=${user.Username}`)
    const [teams, setTeams] = useState([])

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
            <Button key={uuidv4()} style={{ display: "block", marginTop: "1rem" }}>
                {team.Name}
            </Button>
        )
    }

    return (
        <div className='panel'>
            <h5>Teams:</h5>
            {renderTeams()} 
        </div>
    )
}

export default TeamsPanel
