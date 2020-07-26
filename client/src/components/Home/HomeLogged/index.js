import React, {useState, useEffect} from 'react' 
import Boards from './Boards'
import { Col, Row, CardPanel} from 'react-materialize'

const Home = () => { 
  
  useEffect(() => {
    document.body.style.backgroundImage = "" 
  }, [])

  return ( 
  <Row>
    <Col className="col s9 flexboxContainer spaceBetween"> 
      <CardPanel className='size2'>   
        <div>Teams</div>
      </CardPanel> 
      <CardPanel className='size6'> <Boards/> </CardPanel> 
      <CardPanel className='size2'>   
        <div>Friends</div>
      </CardPanel>   
    </Col>
  </Row> 
  ); 
}

export default Home