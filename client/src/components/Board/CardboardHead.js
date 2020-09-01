import React, { useState, useEffect, useRef } from 'react'
import { Dropdown, Icon } from 'react-materialize'
import { v4 as uuidv4 } from 'uuid'
import updateBoard from '../updateBoard'
import axios from 'axios' 

const CardboardHead = ({ boardId, Name, setHideTemp }) => { 
    const [canEditName, setCanEditName] = useState(false)
    const elementRef = useRef()  

    const addCard = () => {
        setHideTemp(false)
    }
    
    const modifyName = () => {
        if (canEditName === false) {
            document.addEventListener("mousedown", handleClick)
            setCanEditName(true)
        }
    }
    
    const handleClick = e => {   
        if (!elementRef.current) {
            document.removeEventListener("mousedown", handleClick)
            return
        }

        //Pressed ouside modify
        if (!elementRef.current.contains(e.target)) {  
            document.removeEventListener("mousedown", handleClick)
            setCanEditName(false) 
        }
    }

    const handleNameChange = (e) => {
        const text = e.currentTarget.textContent

        if (e.key === "Escape") {
            setCanEditName(false)
            document.removeEventListener("mousedown", handleClick)
        }

        if (e.key === "Enter") {
            axios.patch(`/api/boards/${boardId}/cardboards/${Name}`, { Name: text })
                .then(updateBoard(boardId))
            setCanEditName(false)
            document.removeEventListener("mousedown", handleClick)
        }
    }

    const deleteCardboard = () => {
        axios.delete(`/api/boards/${boardId}/cardboards/${Name}`)
            .then(updateBoard(boardId))
    }

    return (
        <div className="cardboard-head">
            <div></div>
            <div contentEditable={canEditName} suppressContentEditableWarning={true}
                onKeyDown={handleNameChange} onDoubleClick={modifyName} ref={elementRef}>
                {Name}
            </div>
            <Dropdown id={uuidv4()} trigger={<a><Icon>toc</Icon></a>}>
                <a className="black-text optionsBoard" onClick={addCard}>
                    add card
                </a>
                <a className="black-text optionsBoard" onClick={modifyName}>
                    modify
                </a>
                <a className="black-text optionsBoard" onClick={deleteCardboard}>
                    delete
                </a>
            </Dropdown>
        </div>
    )
}

export default CardboardHead
