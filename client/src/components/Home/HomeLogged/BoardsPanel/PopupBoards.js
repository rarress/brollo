import React, { useState, useEffect } from 'react'
import { Button, Icon, Dropdown, Row, Col, TextInput } from 'react-materialize'
import { v4 as uuidv4 } from 'uuid'

const Popup = ({ togglePopup, hidePopup, boards }) => {
    const [hide, setHide] = useState(hidePopup)
    const [teams, setTeams] = useState([])
    const [newBoard, setNewBoard] = useState({}) 

    useEffect(() => {
        setHide(hidePopup)
    }, [hidePopup])

    useEffect(() => {
        console.log(newBoard)
    }, [newBoard])

    useEffect(() => {
        if (Object.keys(boards).length !== 0)
            setTeams(Object.keys(boards))
    }, [boards])

    const updateNewBoard = (key, value) => {
        let newData = {}
        newData[key] = value
        setNewBoard(prev => { return { ...prev, ...newData } })
    }

    if (hide === true)
        return null
    else return (
        <div className='popup'>
            <Row>
                <Col>
                    Add new board
                </Col>
                <Col className="col s6">
                    <TextInput placeholder="Team name" onChange={(e) => updateNewBoard("Name", e.target.value)} />
                </Col>
                <Col>
                    <div className="grey-text darken-2">
                        {newBoard.Team ? newBoard.Team : "No team"}
                    </div>
                    <Dropdown trigger={<button className="btn black"> Choose team </button>}>
                        {teams.map( team => 
                            <a key={uuidv4()} onClick={(e) => updateNewBoard("Team", e.target.text)} >
                                    {team}
                            </a>
                        )}
                    </Dropdown>
                </Col>
                <Col className="col s6">
                    <TextInput type="file" />
                </Col>
                <Button className="red lighten-1" icon={<Icon>close</Icon>} onClick={togglePopup} />
            </Row>
        </div>
    )
}

export default Popup