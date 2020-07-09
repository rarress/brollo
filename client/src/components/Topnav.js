import React from 'react'
import { useHistory } from "react-router-dom";
import { Navbar, NavItem, Tabs, Tab } from 'react-materialize'
import './Topnav.css'

const Home = () => { 
    let history = useHistory()

    const changeHandler = (e) => {
       const tabName = e.target.text
       switch (tabName){
            case 'Log in':
                history.push('/login')
                break
            case 'Register':
                history.push('/register')
                break
            default:
                history.push('/')
       } 
    }

    return(
    <Navbar className='deep-purple darken-3' alignLinks="right" brand={<a id="home" href="/"> Home </a>}> 
        <NavItem href="/login">
            Log in
        </NavItem>
        <NavItem href="/register">
            Register
        </NavItem> 
    </Navbar>
    // <Tabs className='deep-purple darken-3' onChange={changeHandler}> 
    //     <Tab title='Home'/>
    //     <Tab title='Log in'/>
    //     <Tab title='Register'/>
    // </Tabs>
    )
}

export default Home