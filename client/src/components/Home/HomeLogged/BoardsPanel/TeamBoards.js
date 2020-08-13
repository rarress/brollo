import React from 'react' 
import Board from './Board'
import { v4 as uuidv4 } from 'uuid'

const TeamPanel = ({ name, boards}) => {  
    return (
    <div className="teamBoards">
        {name === "null"? "Your boards:" : `"${name}" boards:`} 
        { boards.map( (board) => <Board key={uuidv4()} prop={board}/> )}   
    </div>
    )
}

export default TeamPanel
