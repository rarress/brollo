import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import updateBoard from '../../updateBoard'
import RenderTitle from './RenderTitle'
import RenderLabels from './RenderLabels'
import RenderDescription from './RenderDescription'
import './CardPopup.css'

const CardPopup = ({ hide, setHide, boardId, cardboardId, Name, Description, Labels }) => {
    const elementRef = useRef() 

    useEffect(() => {
        if (hide === false) {
            document.addEventListener("mousedown", handleClick)
            return () => {
                document.removeEventListener("mousedown", handleClick)
            }
        }
    }, [hide])

    const handleClick = e => {
        if (!elementRef.current || !elementRef.current.contains(e.target)) {
            document.removeEventListener("mousedown", handleClick)
            setHide(true)
        }
    }

    const modifyCard = (data) => {
        axios.patch(`/api/boards/${boardId}/cardboards/${cardboardId}/cards/${Name}`, data)
            .then(updateBoard(boardId))
    }

    const deleteCard = () => {
        axios.delete(`/api/boards/${boardId}/cardboards/${cardboardId}/cards/${Name}`)
            .then(updateBoard(boardId))
    }

    const renderPopup = () => {
        if (hide)
            return null

        return (
            <div className='card-popup'>
                <div ref={elementRef} className='inside-card-popup'>
                    <RenderTitle Name={Name} cardboardId={cardboardId} modifyCard={modifyCard}/>
                    <RenderLabels Labels={Labels} modifyCard={modifyCard}/>
                    <RenderDescription Description={Description} modifyCard={modifyCard}/>
                    <button onClick={deleteCard}>Delete</button>
                </div>
            </div>
        )
    }

    return (
        <>
            {renderPopup()}
        </>
    )
}

export default CardPopup