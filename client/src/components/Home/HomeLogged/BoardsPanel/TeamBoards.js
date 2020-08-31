import React, { useState } from 'react'  
import {Icon} from 'react-materialize'
import Board from './Board'
import { v4 as uuidv4 } from 'uuid'

const TeamBoards = ({ team, boards }) => { 
    const [hidden, setHidden] = useState(false)
   
    const renderBoards = () => {
        if (hidden)
            return null

        return (
        <div className="boards">
        {
            boards.map(board => {
                if (board.Team === team)
                    return <Board key={uuidv4()} board={board} />
                return null
            })
        }
        </div>
        )
    }

    const toggleHidden = () => {
        setHidden(prev => prev===true? false : true)
    }

    return (
    <div className="teamBoards">
        {!team? "Your boards:" : `${team} boards:`}  
        <a className="boardsButton right" onClick={toggleHidden}> 
            <Icon>
            {hidden? "expand_less" : "expand_more"}
            </Icon>
        </a>
        {renderBoards()}
    </div>
    )
}

export default TeamBoards
