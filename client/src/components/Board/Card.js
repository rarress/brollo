import React from 'react'
import { useDrag } from 'react-dnd' 
import CardInBetweens from './CardInBetweens'

const Card = ({ boardId, cardboardId, name }) => {
    const [, dragRef] = useDrag({
        item: { type: "card", name, cardboardId }
    })

    return (
        <>
            <CardInBetweens boardId={boardId} cardboardId={cardboardId} name={name}/>
            <div ref={dragRef} className="cardboard-card">
                {name}
            </div>
        </>
    )
}

export default Card
