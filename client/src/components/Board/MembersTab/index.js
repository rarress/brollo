import React, { useState, useEffect } from 'react'
import { Button, Icon } from 'react-materialize'
import { v4 as uuidv4 } from 'uuid'
import useData from '../../useData'

const MembersTab = ({ boardId }) => {
    const [members] = useData(`/api/boards/${boardId}/users`)

    useEffect(() => {
        console.log("Members", members)
    }, [members])

    const rightsMap = {
        0: "visibility",
        1: "create",
        2: "star_border"
    }

    return (
        <div className="members-tab" style={{ position: "relative" }}>
            <div className="members-tab-title">
                Members
            </div>
            <div className="members-tab-users">
                {
                    !members ? null : members.map(member =>
                        <div key={uuidv4()} style={{ position: "relative" }}>
                            <span style={{ position: "absolute", margin: "0.25rem 0 0 0.25rem" }}>
                                <Icon tiny={true}>
                                    {rightsMap[member.Rights]}
                                </Icon>
                            </span>
                            <div style={{ margin: "0 0 0 1.5rem" }}>
                                {member.Name}
                            </div>
                        </div>
                    )
                }
            </div>
            <div style={{ position: "absolute", bottom: "5%", left: "40%", right: "40%" }}>
                <Button className="orange lighten-2">
                    +
                </Button>
            </div>
        </div>
    )
}

export default MembersTab
