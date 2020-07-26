import React from 'react' 
import { Col, Row, CardPanel} from 'react-materialize' 
import Board from './Board'
import { v4 as uuidv4 } from 'uuid'

const TeamPanel = ({name, boards}) => {
    console.log(name, boards)
    return (
    <CardPanel className="">
        {name!=="null"? `Team ${name}` : "Private"}
        <Row>
            <Col>
                { boards.map(board => <Board key={uuidv4()} prop={board}/>) }
            </Col>
        </Row>
    </CardPanel>
    )
}

export default TeamPanel
