import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import updateBoard from '../updateBoard'
import axios from 'axios'

const AddNewBoard = ({ boardId }) => {
    const [data, setData] = useState()
    const history = useHistory()

    const handleChange = (e) => {
        setData({ Name: e.target.value })
    }

    const addBoard = () => {
        axios.post(`/api/boards/${boardId}/cardboards`, data)
            .then(updateBoard(boardId))
    }

    const deleteBoard = () => {
        axios.delete(`/api/boards/${boardId}`)
            .then(() => { updateBoard(boardId); history.push("/") })
    }

    return (
        <div className="board-tool">
            <div className="add-board">
                <div>Add new board:</div>
                <input placeholder="Board Name" onChange={handleChange} />
                <button onClick={addBoard}>
                    Add board
                </button>
            </div>
            <div className="delete-board">
                <button onClick={deleteBoard}>
                    Delete board
                </button>
            </div>
        </div>
    )
}

export default AddNewBoard
