import React, { useEffect, useRef } from 'react'
import axios from 'axios'
import updateBoard from '../updateBoard'

const TempCard = ({ hide, setHideTemp, boardId, Name }) => {
    const elementRef = useRef()

    const removeTemp = () => {
        document.removeEventListener("mousedown", handleClick)
        setHideTemp(true)
    }

    useEffect(() => {
        if (hide === false) {
            document.addEventListener("mousedown", handleClick)
            return removeTemp
        }
    }, [hide])

    const handleClick = e => {
        //Pressed ouside modify
        if (!elementRef.current || !elementRef.current.contains(e.target))
            removeTemp()
    }

    const handleNameChange = (e) => {
        const text = e.currentTarget.textContent

        if (e.key === "Escape") {
            removeTemp()
        }

        if (e.key === "Enter") {
            axios.post(`/api/boards/${boardId}/cardboards/${Name}/cards`, { Name: text })
                .then(updateBoard(boardId))
            removeTemp()
        }
    }

    const style = {
        marginTop: "1rem",
        backgroundColor: "gray",
        display: hide ? "none" : "initial",
        textAlign: "center"
    }

    return (
        <div style={style}>
            <div> create new card:</div>
            <div className="cardboard-card" style={{ backgroundColor: "lightgray" }} contentEditable
                ref={elementRef} onKeyDown={handleNameChange} />
        </div>
    )
}

export default TempCard
