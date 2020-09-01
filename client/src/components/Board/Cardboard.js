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
        accept: "card",
        collect: monitor => ({
            isOver: !!monitor.isOver(),
        }),
        drop: (card, monitor) => moveAcrossCardboard(card)
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

    const style = {
        backgroundColor: isOver ? "gray" : "white"
    }

    return (
        <div className="cardboard" ref={drop} style={style}>
            <CardboardHead boardId={boardId} Name={Name} setHideTemp={setHideTemp} />
            <TempCard hide={hideTempCard} setHideTemp={setHideTemp} boardId={boardId} Name={Name} />
            {Cards.map(card =>
                <Card key={uuidv4()} name={card.Name} cardboardId={Name} boardId={boardId} />
            )}
        </div>
    )
}

export default Cardboard
