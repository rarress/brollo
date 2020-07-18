import React from 'react'

export default function FrontMessage({message}) {
    let textClass=""
    if(!message.includes('Enter your Credentials')) {
        textClass="red-text text-darken-2"
    }
    return (
        <h3 className={textClass}>{message}</h3>
    )
}
