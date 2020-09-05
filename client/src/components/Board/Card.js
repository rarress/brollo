import React, { useState } from 'react'
import { useDrag } from 'react-dnd'
import { v4 as uuidv4 } from 'uuid'
import CardInBetweens from './CardInBetweens'
import CardPopup from './CardPopup/index.js'

const Card = ({ boardId, cardboardId, Name, Description, Labels }) => {
    const props = { boardId, cardboardId, Name, Description, Labels } 
    const [hide, setHide] = useState(true)
    const [, dragRef] = useDrag({
        item: { type: "card", Name, cardboardId }
    })

    const clickHandle = () => {
        setHide(false)
    }

    const renderLabels = () => { 
        return (
            <div style={{ display: "flex", flexWrap: "wrap" }}>
                {Labels.map(label => {
                    const color = label.split("$")[0]
                    const text = label.split("$")[1]
                    return (
                        <div key={uuidv4()} className="card-label" style={{ backgroundColor: color }}>
                            {text}
                        </div>
                    )
                })}
            </div>
        )
    }

    return (
        <>
            <CardPopup hide={hide} setHide={setHide} {...props} />
            <CardInBetweens {...props} />
            <div ref={dragRef} className="cardboard-card" onClick={clickHandle}>
                {renderLabels()}
                {Name}
            </div>
        </>
    )
}

export default Card
