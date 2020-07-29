import React from 'react' 
import { Link } from "react-router-dom";
import TopnavItem from './TopnavItem'

const TopnavNotLogged = () => {  
    return(
    <nav className="nav-wrapper deep-purple darken-3"> 
        <Link to="/" className="brand-logo hide-on-med-and-down"> Home </Link> 
        <ul id="nav-mobile" className="right">
            <TopnavItem icon="home" path="/" classes="hide-on-large-only"/> 
            <TopnavItem name="Log in" path="/login"/>
            <TopnavItem name="Register" path="/register"/>  
        </ul> 
    </nav> 
    )
}
 
export default TopnavNotLogged