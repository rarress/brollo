import React from 'react'
import useData from './useData'
import { Preloader } from 'react-materialize'

const Boards = () => {
    const [isLoading, data] = useData('/api/random')

    return (
        <>
            <h5>Boards</h5>
            {isLoading? <Preloader active/> : data}
        </>
    )
}

export default Boards