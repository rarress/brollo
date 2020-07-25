import React from 'react' 
import { Navbar, NavItem, Icon} from 'react-materialize'

const Topnav = ({username}) => {  
    return(
    <Navbar className='deep-purple darken-3' alignLinks="right" brand={<a id="topnavIcon" href="/"> Home </a>}> 
        <NavItem href='/boards'>
            <Icon>
                dashboard
            </Icon>
        </NavItem> 
        <NavItem href='/chat'>
            <Icon>
                chat_bubble_outline
            </Icon>
        </NavItem> 
        <NavItem href='/notifications'>
            <Icon>
                notifications_none
            </Icon>
        </NavItem> 
        <NavItem href={`/user/${username}`}>
            <Icon>
                person
            </Icon>
        </NavItem> 
    </Navbar> 
    )
}

export default Topnav