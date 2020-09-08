import React from 'react'
import { useHistory } from 'react-router-dom'

const Board = ({board}) => {
    const history = useHistory()
    
    const goToBoard = () => {
        history.push(`/boards/${board.Name}`)
    }

    const style = { 
        background: `url(${board.BackgroundImage})`,
        WebkitBackgroundSize: "cover",
        MozBackgroundSize: "cover",
        OBackgroundSize: "cover",
        backgroundSize: "cover",
    } 

    return (
        <div className="board" onClick={goToBoard} style={style}> 
            {board.Name} 
        </div> 
    )
}

export default Board
