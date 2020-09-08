import React from 'react'
import { useDrop } from 'react-dnd'
import updateBoard from '../updateBoard'
import axios from 'axios'

const CardInBetweens = ({ boardId, cardboardId, Name, cardboardStyle }) => {
    const [{ isOver }, drop] = useDrop({
        accept: "card",
        collect: monitor => ({
            isOver: !!monitor.isOver(),
        }),
        drop: (card, monitor) => swapCards(card)
    })

    const swapCards = (card) => { 
        //If card is in same board
        if (card.cardboardId === cardboardId) {
            axios.patch(`/api/boards/${boardId}/cardboards/${cardboardId}/cards`, { Name1: Name, Name2: card.Name })
                .then(updateBoard(boardId))
        }
        //If in different board move it before swaping it 
        else {
            //Add to your board
            axios.post(`/api/boards/${boardId}/cardboards/${cardboardId}/cards`, { Name: card.Name })
                .then(response => {
                    //Delete card from original cardboard 
                    if (response.data.success === true)
                        axios.delete(`/api/boards/${boardId}/cardboards/${card.cardboardId}/cards/${card.Name}`)
                            .then((response => {
                                //Real swap between Cards
                                if (response.data.success === true)
                                    axios.patch(`/api/boards/${boardId}/cardboards/${cardboardId}/cards`, { Name1: Name, Name2: card.Name })
                                        .then(updateBoard(boardId))
                            }))
                })
        }
    }   

    const style = {
        backgroundColor: isOver ? "rgb(78, 78, 78)" : cardboardStyle,
        height: isOver ? "4rem" : "1rem", 
    }

    return (
        <div ref={drop} style={style}>
        </div>
    )
}

export default CardInBetweens
