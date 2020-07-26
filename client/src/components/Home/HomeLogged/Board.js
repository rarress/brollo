import React from 'react'
import { Col, Row, CardPanel} from 'react-materialize'

const Board = ({prop}) => { 
    return (
        <CardPanel className="roundBorder"> 
            {prop.Name} 
        </CardPanel>
    )
}

export default Board
