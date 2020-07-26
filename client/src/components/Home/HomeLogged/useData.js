import React, {useState, useEffect} from 'react'
import axios from 'axios'

const useData = (path) => {
    const [isLoading, setIsLoading] = useState(true)
    const [data, setData] = useState(null)

    useEffect(() => {
        if (data) 
            setIsLoading(false)
    }, [data])

    useEffect(() => {
        axios.get(`${path}`)
             .then( ({data}) => setData(data))
             .catch( () => setData("ERROR"))
    }, [])

    return [isLoading, data]
}

export default useData
