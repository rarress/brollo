import React from 'react'
import axios from 'axios'
import updateBoard from '../updateBoard'

const TempCard = ({ hide, setHideTemp, boardId, Name }) => {  
    const handleNameChange = (e) => {
        const text = e.currentTarget.textContent

        if (e.key === "Escape")
            setHideTemp(true)

        if (e.key === "Enter") {
            axios.post(`/api/boards/${boardId}/cardboards/${Name}/cards`, { Name: text })
                .then(updateBoard(boardId))
            setHideTemp(true)
        }
    }

    return hide ?
        null
        : 
        <div className="cardboard-card" contentEditable onKeyDown={handleNameChange} /> 
}

export default TempCard
