import React, { useState } from 'react'
import { Button, Icon, Dropdown } from 'react-materialize'
import socket from '../../socket'
import axios from 'axios'

const MembersButtons = ({ targetUser, boardId, errors }) => {
    const [button, setButton] = useState()
    const [addedUser, setAddedUser] = useState()
    const [deletedUser, setDeletedUser] = useState()

    const buttonHandler = (buttonClicked) => {
        setButton(prev => prev === buttonClicked ? null : buttonClicked)
        setAddedUser(null)
        setDeletedUser(null)
    }
    
    const refreshData = async () => {
        await new Promise(resolve => setTimeout(resolve, 10))
        socket.emit("update members", boardId) 
    }

    const addMember = () => {
        axios.post(`/api/boards/${boardId}/users`, { Users: [{ Name: addedUser, Rights: "1" }] })
            .then(refreshData()) 
    }

    const changeUserRights = (rights) => {
        axios.patch(`/api/boards/${boardId}/users/${targetUser.Name}`, { Rights: rights.toString() })
            .then(refreshData()) 
    }

    const deleteUser = () => {
        axios.delete(`/api/boards/${boardId}/users/${deletedUser}`)
            .then(refreshData()) 
    }

    const rightsMap = {
        0: "visibility",
        1: "create",
        2: "star_border"
    }

    const renderOptions = () => {
        switch (button) {

            case "add":
                return (
                    <>
                        <input placeholder="New member" onChange={(e) => setAddedUser(e.target.value)} />
                        <Button className="green roundBorder" onClick={addMember}>
                            Add
                            <Icon right>
                                send
                            </Icon>
                        </Button>
                        <br />
                    </>
                )

            case "update":
                if (!targetUser)
                    return <div>select a user</div>
                return (
                    <div>
                        {targetUser.Name}
                        <span style={{ marginRight: "0.5rem" }} />
                        <Dropdown
                            trigger={<button className="btn white">
                                <a>
                                    <Icon>
                                        {rightsMap[targetUser.Rights]}
                                    </Icon>
                                </a>
                            </button>}>
                            <a onClick={() => changeUserRights(0)}>
                                <Icon>visibility</Icon> Read
                            </a>
                            <a onClick={() => changeUserRights(1)}>
                                <Icon>create</Icon> Read/Write
                            </a>
                            <a onClick={() => changeUserRights(2)}>
                                <Icon>star_border</Icon> Admin
                            </a>
                        </Dropdown>
                        <br />
                        <br />
                    </div>
                )

            case "delete":
                return (
                    <> 
                        <input placeholder="Deleted member" onChange={(e) => setDeletedUser(e.target.value)} />
                        <Button className="red roundBorder" onClick={deleteUser}>
                            Delete
                            <Icon right>
                                delete
                            </Icon>
                        </Button>
                        <br />
                    </>
                )

            default:
                return null
        }
    }

    return (
        <div className="members-tab-buttons">
            <div className="red-text">{errors}</div>
            {renderOptions()}
            <div>
                {/* Add button */}
                <Button className="green" onClick={() => buttonHandler("add")}>
                    <Icon>
                        library_add
                    </Icon>
                </Button>

                {/* Change rights button */}
                <Button className="orange" onClick={() => buttonHandler("update")}>
                    <Icon>
                        settings
                    </Icon>
                </Button>

                {/* Delete mebmer button */}
                <Button className="red" onClick={() => buttonHandler("delete")}>
                    <Icon>
                        delete
                    </Icon>
                </Button>
            </div>
        </div>
    )
}

export default MembersButtons
