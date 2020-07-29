import React from 'react'

export default function FrontMessage({message}) {
    let textClass="specialTextColor"
    if(!message.includes('Enter your Credentials')) {
        textClass="red-text text-darken-2"
    }
    return (
        <h1 className={textClass}>{message}</h1>
    )
}
