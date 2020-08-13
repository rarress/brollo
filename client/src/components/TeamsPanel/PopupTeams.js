import React, { useState, useEffect } from 'react'
import { Button, Icon, Dropdown, Row, Col, TextInput } from 'react-materialize'
import { v4 as uuidv4 } from 'uuid'
import axios from 'axios'

const Popup = ({ togglePopup, hidePopup}) => {
    const [hide, setHide] = useState(hidePopup) 
    const [data, setData] = useState({}) 

    useEffect(() => {
        setHide(hidePopup)
    }, [hidePopup])
 
    const updateData = (key, value) => { 
        let newData = {}
        newData[key] = value
        setData(prev => { return { ...prev, ...newData } })
    }
    
    const submitData = () => {
        axios.post('/api/teams', data).then(togglePopup())
    }

    if (hide === true)
        return null
    else return (
        <div className='popup'>
            <Row>
                <h5> Create new team </h5>
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

export default Popup