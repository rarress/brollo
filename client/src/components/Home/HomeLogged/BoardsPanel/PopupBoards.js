import React, { useState } from 'react'
import { Button, Icon, Dropdown, Row, Col, TextInput } from 'react-materialize'
import { v4 as uuidv4 } from 'uuid'
import axios from 'axios'

const Popup = ({ teams, refreshData }) => {
    const [hide, setHide] = useState(true)
    const [data, setData] = useState({})

    const togglePopup = () => {
        setHide(prev => prev === true ? false : true)
    }

    const updateData = (key, value) => {
        let newData = {}
        newData[key] = value
        setData(prev => { return { ...prev, ...newData } })
    }

    const submitData = () => {
        axios.post('/api/boards', data)
             .then(togglePopup())
             .finally(refreshData())
    }

    const addButton = () => {
        return (
            <div style={{ marginBottom: "4rem" }}>
                <Button className="red left" icon={<Icon>add</Icon>} tooltip="Add new board" onClick={togglePopup} />
            </div>
        )
    }

    const renderPopup = () => {
        if (hide)
            return null

        return (
            <div className='popup'>
                <Row>
                    <h5> Add new board </h5>
                    <Col className="col s6">
                        <TextInput placeholder="Board name" onChange={(e) => updateData("Name", e.target.value)} />
                    </Col>
                    <Col>
                        <Dropdown trigger={<button className="btn black"> {data.Team ? data.Team : "No team"} </button>}>
                            {teams.map( team =>
                                <a href="# " key={uuidv4()} onClick={(e) => updateData("Team", e.target.text)} >
                                    {team}
                                </a>
                            )}
                        </Dropdown>
                    </Col>
                    <Col>
                        <TextInput placeholder="Image url" onChange={(e) => updateData("BackgroundImage", e.target.value)} />
                    </Col>
                    <br />
                    <Button className="green lighten-1" icon={<Icon>check</Icon>} onClick={submitData} />
                    <Button className="red lighten-1" icon={<Icon>close</Icon>} onClick={togglePopup} />
                </Row>
            </div>
        )
    }

    return (
        <>
            {addButton()}
            {renderPopup()}
        </>
    )
}

export default Popup