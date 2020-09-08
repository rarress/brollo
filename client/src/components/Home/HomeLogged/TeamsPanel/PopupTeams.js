import React, { useState } from 'react'
import { Button, Icon, Row, Col, TextInput } from 'react-materialize'
import axios from 'axios'

const Popup = ({refreshData}) => {
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
        axios.post('/api/teams', data)
            .then(togglePopup())
            .finally(refreshData())
    }

    const addButton = () => {
        return (
            <div style={{ marginBottom: "1rem" }}>
                <Button className="orange left" icon={<Icon>add</Icon>} tooltip="Add new board" onClick={togglePopup} />
            </div>
        )
    }

    const renderPopup = () => {
        if (hide)
            return null

        return (
            <div className='popup'>
                <Row>
                    <h5> Add new team </h5>
                    <Col className="col s6">
                        <TextInput placeholder="Team name" onChange={(e) => updateData("Name", e.target.value)} />
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