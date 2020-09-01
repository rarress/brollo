import React from 'react'
import { Button } from 'react-materialize'

const RenderLabels = ({ Labels }) => {
    return (
        <div>
            <Button floating small={true} style={{ marginRight: "0.5rem" }} className="white black-text"> + </Button>
            Labels:
            {Labels.map(label => <div>{label}</div>)}
        </div>
    )
}

export default RenderLabels
