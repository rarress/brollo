import React, { useState } from 'react'
import { useDrag } from 'react-dnd'
import CardInBetweens from './CardInBetweens'
import CardPopup from './CardPopup/index.js'

const Card = ({ boardId, cardboardId, Name, Description, Labels }) => {
    const props = { boardId, cardboardId, Name, Description, Labels }
    const [name, setName] = useState(Name)
    const [hide, setHide] = useState(true)
    const [, dragRef] = useDrag({
        item: { type: "card", name, cardboardId }
    })

    const clickHandle = () => {
        setHide(false)
    }

    return (
        <>
            <CardPopup hide={hide} setHide={setHide} {...props}/>
            <CardInBetweens boardId={boardId} cardboardId={cardboardId} name={name} />
            <div ref={dragRef} className="cardboard-card" onClick={clickHandle}>
                {name}
            </div>
        </>
    )
}

export default Card
