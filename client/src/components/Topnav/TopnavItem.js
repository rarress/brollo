import React from 'react'
import { Link } from "react-router-dom"
import { Icon } from 'react-materialize'

const NavItem = ({name, icon, path, classes}) => { 
    return (
        <li className={classes}>
            <Link to={path}> 
                {name? name : null}
                {icon? <Icon>{icon}</Icon> : null}  
            </Link>
        </li> 
    ) 
}

export default NavItem