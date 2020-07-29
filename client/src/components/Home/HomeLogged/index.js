import React, {useEffect} from 'react' 
import BoardsPanel from './BoardsPanel/index.js'
import { Col, Row, CardPanel} from 'react-materialize'
import './homeLogged.css'

const Home = ({user}) => { 
  
  useEffect(() => {
    document.body.style.backgroundImage = "" 
  }, [])

  return ( 
  <Row>
    <Col className="col s9 homeContainer">  
        <CardPanel className='size2'>Teams</CardPanel> 
        <BoardsPanel user={user}/>   
        <CardPanel className='size2'>Friends</CardPanel> 
    </Col>
  </Row> 
  ); 
}

export default Home