import React from 'react'
import { Icon } from 'react-materialize'
import { v4 as uuidv4 } from 'uuid'

const Members = ({ members, setTargetUser }) => {

    const iconMap = {
        0: "visibility",
        1: "create",
        2: "star_border"
    } 

    const renderMembers = () => {
        return members.map(member =>
            <div key={uuidv4()} className="members-tab-user" onClick={() => setTargetUser(member)}>
                <span>
                    <Icon tiny={true}>
                        {iconMap[member.Rights]}
                    </Icon>
                </span>
                <div>
                    {member.Name}
                </div>
            </div>
        )
    }

    return !members ? null : (
        <div className="members-tab-users">
            {renderMembers()}
        </div>
    )
}

export default Members
