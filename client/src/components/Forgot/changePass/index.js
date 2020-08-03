import React, { useState, useEffect } from 'react'
import { Col, Row, CardPanel, TextInput, Button, Icon } from 'react-materialize'
import { useParams, useHistory } from 'react-router-dom'
import axios from 'axios'
const ChangePass = () => {

    let history = useHistory()
    const [data, setData] = useState({ msg: "Change your Password" })
    const [response, setResponse] = useState()
    const { token } = useParams()
    useEffect(() => {
        document.body.style.backgroundImage = "url(/purpleForest.jpg)"
    }, [])



    axios.post('/api/forgotPassword/verify', { token }).then(response => {
        setResponse(response.data.success)
    }).catch(err => history.push('/error'))
    const inputHandler = (e) => {
        const newData = {}
        newData[e.target.id] = e.target.value
        setData(prevData => {
            return { ...prevData, ...newData }
        })
    }

    const isValidPassword = () => {
        const upperChar = /[A-Z]/g
        const lowerChar = /[a-z]/g
        const digit = /[0-9]/g
        const minLength = 8
        if (!data["Password"].match(upperChar))
            return false
        if (!data["Password"].match(lowerChar))
            return false
        if (!data["Password"].match(digit))
            return false
        if (data["Password"].length < minLength)
            return false
        return true
    }

    const onSubmit = () => {
        if (!(data.ConfirmPassword || data.Password)) {
            setData({ msg: "Insert a value" })
        } else if (data.Password !== data.ConfirmPassword) {
            setData({ msg: "Both passwords must match" })
        } else
            if (isValidPassword()) {
                axios.post('/api/forgotPassword/change', { Password: data.Password, id: token }).then(response => {
                    if (response.data.success) {
                        history.push('/login')
                    } else {
                        history.push('/error')
                    }
                
                }).catch(err => console.log(err))
            } else {
                setData({ msg: "Password is too weak! You need 8 characters, 1 lowercase letter, 1 uppercase letter and 1 digit" })
            }

    }

    const render = () => {
        if (response) {
            return <Col className="col s6">
                <h1 className="specialTextColor">{data.msg}</h1>
                <CardPanel className="green lighten-5 roundBorder">
                    <TextInput type="password" icon="lock" placeholder="Enter your new password" id="Password" className="validate" onChange={inputHandler} />
                    <TextInput type="password" icon="lock" placeholder="Confirm your password" id="ConfirmPassword" className="validate" onChange={inputHandler} />
                    <Button node="button" type="submit" waves="light" onClick={onSubmit} >
                        Submit <Icon right>send</Icon>
                    </Button>
                </CardPanel>
            </Col>
        } else {
            return <h1 className="center-align specialTextColor"> Sorry, something went wrong! </h1>
        }
    }




    return (

        <Row className="center-align">
            {render()}
        </Row>

    )


}


export default ChangePass