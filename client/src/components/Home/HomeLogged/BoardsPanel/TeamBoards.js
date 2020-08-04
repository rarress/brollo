import React from 'react' 
import Board from './Board'
import { v4 as uuidv4 } from 'uuid'

const TeamPanel = ({ name, boards}) => {
    
    const getNameGroup = () => {
        if (name === "null")
            return "Your boards:"
        return `${name} boards:`
    }

    return (
    <div className="teamBoards">
        {name === "null"? "Your boards:" : `\"${name}\" boards:`}
        <div className="teamBordsItems"> 
            { boards.map( (board) => 
                <Board key={uuidv4()} prop={board}/>
            )}  
        </div>
    </div>
    )
}

export default TeamPanel
