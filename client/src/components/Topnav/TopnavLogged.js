import React from 'react'  
import TopnavItem from './TopnavItem'

const TopnavLogged = ({user}) => {   
    return( 
    <nav className="nav-wrapper deep-purple darken-3">  
        <ul id="nav-mobile" className="right">  
            <TopnavItem icon="dashboard" path="/"/> 
            <TopnavItem icon="notifications_none" path="/notifications"/> 
            <TopnavItem icon="person" path={`/user/${user.Username}`}/>  
        </ul> 
    </nav> 
    )
}
export default TopnavLogged