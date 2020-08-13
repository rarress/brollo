import React, { useState, useEffect } from 'react'
import { Button, Icon, Dropdown, Row, Col, TextInput } from 'react-materialize'
import { v4 as uuidv4 } from 'uuid'
import axios from 'axios'

const Popup = ({ togglePopup, hidePopup, boards }) => {
    const [hide, setHide] = useState(hidePopup)
    const [teams, setTeams] = useState([])
    const [data, setData] = useState({}) 

    useEffect(() => {
        setHide(hidePopup)
    }, [hidePopup])

    useEffect(() => {
        if (Object.keys(boards).length !== 0)
            setTeams(Object.keys(boards))
    }, [boards])

    const updateData = (key, value) => { 
        let newData = {}
        newData[key] = value
        setData(prev => { return { ...prev, ...newData } })
    }
    
    const submitData = () => {
        axios.post('/api/boards', data).then(togglePopup())
    }

    if (hide === true)
        return null
    else return (
        <div className='popup'>
            <Row>
                <h5> Add new board </h5>
                <Col className="col s6">
                    <TextInput placeholder="Board name" onChange={(e) => updateData("Name", e.target.value)} />
                </Col>
                <Col>
                    <Dropdown trigger={<button className="btn black"> {data.Team ? data.Team : "No team"} </button>}>
                        {teams.map(team =>
                            <a key={uuidv4()} onClick={(e) => updateData("Team", e.target.text)} >
                                {team}
                            </a>
                        )}
                    </Dropdown>
                </Col>
                {/*TODO: ADD IMAGE INPUT*/}
                <br />
                <Button className="green lighten-1" icon={<Icon>check</Icon>} onClick={submitData} />
                <Button className="red lighten-1" icon={<Icon>close</Icon>} onClick={togglePopup} />
            </Row>
        </div>
    )
}

export default Popup