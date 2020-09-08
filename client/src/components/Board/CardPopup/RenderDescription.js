import React, { useState, useEffect, useRef } from 'react'
import { Icon } from 'react-materialize' 

const RenderDescription = ({ modifyCard, Description }) => {
    const elementRef = useRef() 
    const [isContentEditable, setIsContentEditable] = useState(false)

    const reset = () => {
        document.removeEventListener("mousedown", handleClick)
        setIsContentEditable(false)
    }

    useEffect(() => {
        if (isContentEditable === true) {
            elementRef.current.focus()
            document.addEventListener("mousedown", handleClick)
            return reset
        }
    }, [isContentEditable])

    const handleClick = e => {
        if (!elementRef.current || !elementRef.current.contains(e.target))
            reset()
    }

    const handleChange = (e) => {
        const text = e.currentTarget.textContent 

        if (e.key === "Escape") {
            reset()
        }

        if (e.key === "Enter") {
            modifyCard({Description: text})
            reset()
        }
    }

    return (
        <div>
            <Icon tiny={true}> description </Icon> Description
            <div className="description" onClick={() => { setIsContentEditable(true) }}>
                {
                    isContentEditable ?
                        <div ref={elementRef} contentEditable onKeyDown={handleChange} />
                        :
                        <div>{  Description || "No description..." }</div>
                }
            </div>
        </div>
    )
}

export default RenderDescription