import React from 'react' 
import { v4 as uuidv4 } from 'uuid'
import {Slide, Caption} from 'react-materialize'

const ShowcaseItem = ({text, src, type, color, image}) => {  
  
  return ( 
    <Slide className="roundBorder" image={<img alt="" src={src}/>}>
        <Caption placement={type} className={`${color}-text`}>  
            <TextDisplayed text={text}/>
            {image? <img alt="" src={image.src} style={image.style}/> : null}
        </Caption>
    </Slide>  
  ); 
}

const TextDisplayed = ({text}) => {
    const textKeys = Object.keys(text) //keys are html tags
    return (
    <>{
        textKeys.map( (Tag) => {
            let lines = text[Tag].split("[ENDLINE]")
            return lines.map( (line) => 
                <Tag key={uuidv4()}> 
                    {line} 
                </Tag> 
            )
        })
    }</> 
    )
}
 
export default ShowcaseItem