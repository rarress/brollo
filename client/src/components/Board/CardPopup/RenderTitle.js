import React, { useState, useEffect, useRef } from 'react'
import { Icon } from 'react-materialize'

const RenderTitle = ({ Name, cardboardId, modifyCard }) => {
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
            modifyCard({ Name: text })
            reset()
        }
    }

    return (
        <div>
            <Icon tiny={true}> event_note </Icon>
            {
                isContentEditable ?
                    <span ref={elementRef} contentEditable onKeyDown={handleChange} />
                    :
                    <span onClick={() => { setIsContentEditable(true) }}>
                        {Name}
                    </span>
            }
            <div style={{ fontStyle: "italic", textDecoration: "underline" }}>
                in cardboard “{cardboardId}”
            </div>
        </div>
    )
}

export default RenderTitle
