import React, { useState, useEffect, useRef } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Button } from 'react-materialize'

const RenderLabels = ({ modifyCard, Labels }) => {
    const elementRef = useRef()
    const [createLabel, setCreateLabel] = useState(false)
    const [labels, setLabels] = useState(Labels)
    const [newColor, setNewColor] = useState()
    const [newName, setNewName] = useState()

    useEffect(() => {
        if (labels !== Labels)
            modifyCard({ Labels: labels })
    }, [labels])

    //Mouse click ouside checking
    const reset = () => {
        document.removeEventListener("mousedown", handleClick)
        setNewColor()
        setNewName()
        setCreateLabel(false)
    }

    useEffect(() => {
        if (createLabel === true) {
            document.addEventListener("mousedown", handleClick)
            return reset
        }
    }, [createLabel])

    const handleClick = e => {
        if (!elementRef.current || !elementRef.current.contains(e.target))
            reset()
    }
    //End of mouse click checking   

    const addLabel = () => {
        if (!createLabel)
            return

        return (
            <div ref={elementRef}>
                <input type="color" onChange={changeColor} />
                <div contentEditable style={{ width: "50%", display: "inline-block", }} onKeyUp={changeName} />
                <Button floating type="submit" className="red" onClick={submitNewLabel}> done </Button>
            </div>
        )
    }

    const changeColor = (e) => {
        setNewColor(e.target.value)
    }

    const changeName = (e) => {

        if (e.key === "Escape") {
            reset()
            return
        }

        setNewName(e.currentTarget.textContent)

        if (e.key === "Enter") {
            submitNewLabel()
        }
    }

    const submitNewLabel = () => {
        if (!newName || !newColor || newName.includes("$"))
            return
        setLabels(prev => [...prev, `${newColor}$${newName}`])
    }

    const remove = (removedLabel) => {
        const newLabels = Labels.filter(label => label !== removedLabel)
        setLabels(newLabels)
    }

    return (
        <div>
            <Button floating small={true} style={{ marginRight: "0.5rem" }} className="white black-text" onClick={() => setCreateLabel(true)}> + </Button>
            Labels:
            {addLabel()}
            <div style={{ display: "flex", flexWrap: "wrap" }}>
                {Labels.map(label => {
                    const color = label.split("$")[0]
                    const text = label.split("$")[1]
                    return <div key={uuidv4()} className="label" style={{ backgroundColor: color }} onClick={() => remove(label)}>{text}</div>
                })}
            </div>
        </div>
    )
}

export default RenderLabels
