import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid' 
import useData from '../useData'
import ErrorPage from '../ErrorPage'
import Cardboard from './Cardboard'
import BoardTools from './BoardTools'
import socket from '../socket'
import './board.css'

const Board = ({ user }) => { 
    const { id } = useParams() 
    const [boardDetails, refreshDetails] = useData(`/api/boards/${id}`, (data) => data[0])
    const [cardboards, refreshCB, errorCards] = useData(`/api/boards/${id}/cardboards`, (data) => data[0])

    useEffect(() => {
        console.log("boardDetails", boardDetails)
        console.log("cardboards", cardboards, errorCards)
    }, [boardDetails, cardboards, errorCards]) 

    useEffect(() => {
        socket.emit("join", id)
        socket.on("update", () => {
            refreshDetails()
            refreshCB()
        })
    },[])

    const renderCardboards = () => {
        if (!user)
            return <ErrorPage />

        if (errorCards)
            return (
                <div style={{ marginTop: "4rem", fontSize: "2rem" }}>
                    <div className="center">
                        {errorCards}
                    </div>
                </div>
            )

        if (!cardboards || cardboards.length === 0)
            return null

        return cardboards.map(cardboard => {
            cardboard.boardId = id 
            return <Cardboard key={uuidv4()} {...cardboard} />
        })
    } 

    return (
        <div className="boardPage">
            <BoardTools boardId={id}/>
            {renderCardboards()}
        </div>
    )
}

export default Board
