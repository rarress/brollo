import React from 'react'
import useData from './useData'
import { Preloader } from 'react-materialize'
import Board from './Board' 
import { v4 as uuidv4 } from 'uuid'

const Boards = ({user}) => {
    const [isLoading, response] = useData(`/api/boards/find?User=${user.Username}`)

    return (
        <>
            <h5>Boards</h5>
            {
                isLoading? 
                <Preloader active/> 
                : 
                response.data.map( (boardData) => <Board key={uuidv4()} prop={boardData}/>)
            }
        </>
    )
}

export default Boards