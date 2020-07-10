import React from 'react' 
import { Navbar, NavItem} from 'react-materialize'

const Home = () => {  
    return(
    <Navbar className='deep-purple darken-3' alignLinks="right" brand={<a id="topnavIcon" href="/"> Home </a>}> 
        <NavItem href="/login">
            Log in
        </NavItem>
        <NavItem href="/register">
            Register
        </NavItem> 
    </Navbar> 
    )
}

export default Home