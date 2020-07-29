import React from 'react' 
import { useHistory } from 'react-router-dom'

const Board = ({prop}) => { 
    console.log(prop)
    const history = useHistory()
    
    const goToBoard = () => {
        history.push(`/board/${prop._id}`)
    }

    const style = {
        // backgroundImage: `url(${prop.BackgroundImage})`
        background: `url(${prop.BackgroundImage})`,
        WebkitBackgroundSize: "cover",
        MozBackgroundSize: "cover",
        OBackgroundSize: "cover",
        backgroundSize: "cover",
    }

    return (
        <div className="board" onClick={goToBoard} style={style}> 
            {prop.Name} 
        </div>
    )
}

export default Board
