import React, { useState } from 'react'
import { Button, Icon } from 'react-materialize'
import Popup from './PopupBoards'
  

const Toolbar = ({boards, user}) => {
    const [hidePopup, setHidePopup] = useState(true) 
    
    const style = {
        marginBottom: "4rem",
    }  

    const togglePopup = () => {
        setHidePopup(prev => prev === true ? false : true)
    }

    return (
        <div style={style}>
            <Popup togglePopup={togglePopup} hidePopup={hidePopup} boards={boards}/>
            <Button
                className="pink lighten-3 left"
                icon={<Icon>add</Icon>}
                tooltip="Add new board"
                onClick={togglePopup}
            />
        </div>
    )
}

export default Toolbar