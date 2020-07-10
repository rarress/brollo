import React from 'react'  
import { Button, Icon } from 'react-materialize'
import { useHistory } from "react-router-dom";

const Submit = ({data, setError}) => {
    const history = useHistory()

    const allFieldCompleted = () => {
        const keys = Object.keys(data)
        const requiredField = ["First Name", "Last Name", "Email", "Username", "Password", "Confirm Password"] 
        for (let i in requiredField)
            if (!keys.includes(requiredField[i]))
                return false
        return true
    }

    const isValidEmail = () => {
        if (!data["Email"].includes("@"))
            return false
        return true
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

    const passwordsAreEqual = () => { 
        if (data["Password"] !== data["Confirm Password"])
            return false
        return true
    }

    const onSubmit = () => {
        if (!allFieldCompleted()) {
            setError("All fields are required!")
            return
        }
        
        if (!isValidEmail()) {
            setError("Invalid email!")
            return
        }
        
        if (!isValidPassword()) {
            setError("Password is too weak![ENDLINE]Make sure to have at least 8 characters, 1 lowercase letter, 1 uppercase letter and 1 digit")
            return
        }

         if (!passwordsAreEqual()) {
            setError("The passwords are not equal!")
            return
        }
         
        console.log("TOTUL E OK! DATELE VOR FI TRIMITSE CATRE")
        // TODO: TRIMITE {data} CATRE SERVER
        history.push("/login"); 
    }

    return(
    <Button onClick={onSubmit} node="button" type="submit" waves="light" className="submitButton">
        Submit
        <Icon right>
            send
        </Icon>
    </Button>
    )
}

export default Submit