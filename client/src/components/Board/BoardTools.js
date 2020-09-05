import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Button } from 'react-materialize'
import MembersTab from './MembersTab'
import updateBoard from '../updateBoard'
import axios from 'axios'

const AddNewBoard = ({ boardId }) => {
    const [boardData, setBoardData] = useState()
    const [backgroundImage, setBackgroundImage] = useState()
    const history = useHistory()

    const handleNameChange = (e) => {
        setBoardData({ Name: e.target.value })
    }

    const handleImageChange = (e) => {
        setBackgroundImage({ BackgroundImage: e.target.value })
    }

    const addBoard = () => {
        axios.post(`/api/boards/${boardId}/cardboards`, boardData)
            .then(updateBoard(boardId))
    }

    const changeBackground = () => {
        axios.patch(`/api/boards/${boardId}/backgroundImage`, backgroundImage)
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
                <input placeholder="Board Name" onChange={handleNameChange} />
                <Button className="blue lighten-1 roundBorder" onClick={addBoard}>
                    Add board
                </Button>
            </div>
            <div className="change-background">
                <input placeholder="Image Url" onChange={handleImageChange} />
                <Button className="white black-text roundBorder" onClick={changeBackground}>
                    <div style={{ fontSize: "0.6rem", lineHeight: "1rem" }}>
                        Change Background
                    </div>
                </Button>
            </div>
            <div className="delete-board">
                <Button className="red roundBorder" onClick={deleteBoard}>
                    Delete board
                </Button>
            </div>
            <MembersTab boardId={boardId} />
        </div>
    )
}

export default AddNewBoard
