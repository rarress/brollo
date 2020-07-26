import React, {useState, useEffect} from 'react' 
import BoardsPanel from './BoardsPanel'
import { Col, Row, CardPanel} from 'react-materialize'

const Home = ({user}) => { 
  
  useEffect(() => {
    document.body.style.backgroundImage = "" 
  }, [])

  return ( 
  <Row>
    <Col className="col s9 flexboxContainer">  
        <div className='size2'>Teams</div> 
        <BoardsPanel user={user}/>   
        <div className='size2 marginLeft'>Friends</div> 
    </Col>
  </Row> 
  ); 
}

export default Home