import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import axios from 'axios'
import { Icon } from 'react-materialize'
import useData from '../../../useData'

const Team = ({ team, refreshData }) => {
    const [teamDetails] = useData(`/api/teams/${team}`)
    const [showTeam, setShowTeam] = useState(false)
    const [input, setInput] = useState() 

    const addUser = () => {
        axios.post(`/api/teams/${team}`, { User: input })
            .then(refreshData())
    }

    const removeUser = () => {
        axios.delete(`/api/teams/${team}/user/${input}`)
            .then(refreshData())
    }

    const deleteTeam = () => {
        axios.delete(`/api/teams/${team}`)
            .then(refreshData())
    }

    const renderTeam = () => {
        if (!showTeam || !teamDetails)
            return null
        return (
            <div className="team-details">
                Members:
                <div className="team-details-members">
                    {teamDetails.Members.map(member =>
                        <div key={uuidv4()}>
                            {` - ${member}`}
                        </div>
                    )}
                    {" -"}
                </div>
                <input placeholder="Add member" onChange={(e) => setInput(e.target.value)} />
                <button className="btn roundBorder green" onClick={addUser}>
                    <Icon>
                        add
                    </Icon>
                </button>
                <button className="btn roundBorder red" onClick={removeUser}>
                    <Icon>
                        delete
                    </Icon>
                </button>
                <br />
                <br />
                <button className="btn red" onClick={deleteTeam}>
                    Delete Team
                </button>
                <br />
                <br />
            </div>
        )

    }

    return (
        <>
            <div className="team" onClick={() => setShowTeam(prev => prev === true ? false : true)}>
                {team}
            </div>
            {renderTeam()}
        </>
    )
}

export default Team
