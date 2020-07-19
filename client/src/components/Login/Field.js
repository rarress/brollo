import React from 'react'
export default function Field({placeholder,id,type,inputHandler}) {
    return (
        <div>
          <input placeholder={placeholder} id={id} type={type} className="validate" onChange={inputHandler}/>
         

        </div>
       
    )
}
