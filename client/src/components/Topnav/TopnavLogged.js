import React from 'react' 
import { Link } from "react-router-dom"
import TopnavItem from './TopnavItem'

const TopnavLogged = ({user}) => {   
    return( 
    <nav className="nav-wrapper deep-purple darken-3"> 
        <Link to="/" className="brand-logo hide-on-med-and-down"> Home </Link> 
        <ul id="nav-mobile" className="right"> 
            <TopnavItem icon="home" path="/" classes="hide-on-large-only"/> 
            <TopnavItem icon="dashboard" path="/boards"/> 
            <TopnavItem icon="group" path="/teams"/> {/*group_add*/}
            <TopnavItem icon="notifications_none" path="/notifications"/> {/*notifications_active*/}
            <TopnavItem icon="person" path={`/user/${user.Username}`}/>  
        </ul> 
    </nav> 
    )
}
export default TopnavLogged