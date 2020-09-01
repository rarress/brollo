import {useState, useEffect} from 'react'
import axios from 'axios'

const useData = (path, customFunc) => { 
    const [data, setData] = useState(null) 
    const [error, setError] = useState(null)

    const refreshData = () => { 
        axios.get(`${path}`)
             .then(({data}) => {     
                if (data.success === false)
                    setError(data.message)
                if (!customFunc)
                    setData(data.data)
                else
                    setData(customFunc(data.data)) 
             })
             .catch( () => setData(null))
    }

    useEffect(refreshData, [])

    return [data, refreshData, error]
}

export default useData
