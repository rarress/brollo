import React from 'react'
import TopnavNotLogged from './TopnavNotLogged'
import TopnavLogged from './TopnavLogged'

export default function Topnav({user}) {
    return user? <TopnavLogged user={user}/> : <TopnavNotLogged/>
}
