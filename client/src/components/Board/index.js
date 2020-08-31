import React, { useState, useEffect } from 'react'
import ErrorPage from '../ErrorPage'
import { useParams, useHistory } from 'react-router-dom'
import useData from '../useData' 
import { v4 as uuidv4 } from 'uuid'
import './board.css'

const Board = ({ user }) => {
    const history = useHistory() 
    const { id } = useParams()

    const [boardDetails] = useData(`/api/boards/${id}`, (data) => data[0])
    const [cardboards,,errorCards] = useData(`/api/boards/${id}/cardboards`, (data) => data[0])

    useEffect(() => {
     //   console.log("boardDetails", boardDetails)
    }, [boardDetails])
    
    useEffect(() => {
        console.log("cardboards", cardboards, errorCards)
    }, [cardboards, errorCards])

    const renderBoard = () => {
        if (!user)
            return <ErrorPage />

        if (errorCards)
            return (
                <div style={{marginTop: "4rem", fontSize: "2rem"}}>
                    <div className="center">{errorCards}</div>
                </div>
            )
 
        if (!cardboards || cardboards.length === 0)
            return <div>No cardboards!</div>

        return cardboards.map(cardboard =>  
            <div className="cardboard" key={uuidv4()}> 
                <div className="cardboard-head">
                   {cardboard.Name}
                </div>
                {cardboard.Cards.map(card => 
                    <div className="cardboard-card" key={uuidv4()}>
                        {card.Name}
                    </div>)
                }
            </div>
        )
    }

    return (
        <div className="center">
            <div className="boardPage">
                {renderBoard()}
            </div>
        </div>
    )
}

export default Board
