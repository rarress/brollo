import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { useDrop } from 'react-dnd'
import axios from 'axios'
import updateBoard from '../updateBoard'
import TempCard from './TempCard'
import CardboardHead from './CardboardHead'
import Card from './Card'

const Cardboard = ({ boardId, Name, Cards }) => {
    const [hideTempCard, setHideTemp] = useState(true)
    const [{ isOver }, drop] = useDrop({
        accept: ["card", "cardboardHead"],
        collect: monitor => ({
            isOver: !!monitor.isOver(),
        }),
        drop: (item, monitor) => item.type === "card" ? moveAcrossCardboard(item) : swapCardboards(item)
    })

    const moveAcrossCardboard = (card) => {
        //Add card in second cardboard
        axios.post(`/api/boards/${boardId}/cardboards/${Name}/cards`, { Name: card.name })
            .then((response) => {
                //Delete card from original cardboard 
                if (response.data.success === true)
                    axios.delete(`/api/boards/${boardId}/cardboards/${card.cardboardId}/cards/${card.name}`)
                        .then(updateBoard(boardId))
            })
    }

    const swapCardboards = (cardboard) => {
        axios.patch(`/api/boards/${boardId}/cardboards`, { Name1: cardboard.Name, Name2: Name })
            .then(updateBoard(boardId))
    }

    const style = {
        backgroundColor: isOver ? "gray" : "white"
    }

    return (
        <div className="cardboard" ref={drop} style={style}>
            <CardboardHead boardId={boardId} Name={Name} setHideTemp={setHideTemp} cardboardStyle={style}/>
            <TempCard hide={hideTempCard} setHideTemp={setHideTemp} boardId={boardId} Name={Name} />
            {Cards.map(card =>
                <Card key={uuidv4()} {...card} cardboardId={Name} boardId={boardId} />
            )}
        </div>
    )
}

export default Cardboard
