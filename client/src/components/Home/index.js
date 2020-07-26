import React from 'react'
import HomeLogged from './HomeLogged'
import HomeNotLogged from './HomeNotLogged'

export default function Home({user}) {
    return user? <HomeLogged user={user}/> : <HomeNotLogged/>
}
