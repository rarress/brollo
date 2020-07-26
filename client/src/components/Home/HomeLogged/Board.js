import React from 'react'
import { Col, Row, CardPanel} from 'react-materialize'

const Board = ({prop}) => {
    console.log(prop, prop.Name)
    return (
        <CardPanel>
            <Row>
                <Col>
                    {prop.Name}
                </Col>
            </Row>
        </CardPanel>
    )
}

export default Board
