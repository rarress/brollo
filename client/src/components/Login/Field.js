import React from 'react'
export default function Field({placeholder,type,inputHandler}) {
    return (
        <div>
          <input placeholder={placeholder} id={placeholder} type={type} className="validate" onChange={inputHandler}/>
         

        </div>
       
    )
}
