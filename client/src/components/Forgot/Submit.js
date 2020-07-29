import React from 'react'
import { Button, Icon } from 'react-materialize'
export default function Submit() {
    return (
        <Button node="button" type="submit" waves="light">
        Submit
        <Icon right>
            send
        </Icon>
    </Button>

    )
}
