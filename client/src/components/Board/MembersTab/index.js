import React, { useState, useEffect } from 'react'
import Members from './Members'
import MembersButtons from './MembersButtons'
import { Icon } from 'react-materialize'
import useData from '../../useData'
import socket from '../../socket'
import './MembersTab.css'

const MembersTab = ({ boardId }) => {
    const [members, refreshMembers, errors] = useData(`/api/boards/${boardId}/users`)
    const [targetUser, setTargetUser] = useState()

    useEffect(() => { 
        socket.on("update members", () => {
            refreshMembers()
        }) 
    }, [])

    return (
        <div className="members-tab">
            <div className="members-tab-title">
                Members
            </div>
            <Icon tiny={true}>visibility</Icon> = Read Only
            <br />
            <Icon tiny={true}>create</Icon> = Read/ Write
            <br />
            <Icon tiny={true}>star_border</Icon> = Admin
            <br />
            <Members members={members} setTargetUser={setTargetUser} refreshMembers={refreshMembers} errors={errors}/>
            <MembersButtons targetUser={targetUser} boardId={boardId}/>
        </div >
    )
}

export default MembersTab
