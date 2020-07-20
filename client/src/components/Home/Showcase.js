import React from 'react' 
import {Slider} from 'react-materialize'
import ShowcaseItem from './ShowcaseItem'

const Showcase = () => {  
    const text1 = { 
        h3: 'Welcome to Brollo! 🎉',
        h5: 'Create and share task boards![ENDLINE]Manage and keep track of all things you need to do...',
        h2: '...FOR FREE! 😮'
    }
    const text2 = {
        h3: 'Create a team!',
        h5: 'Whether it’s for work 💻 or school 🏫 or a vacation ✈️[ENDLINE] Brollo is here to help you stay organized! 😎'
    }
    const text3 = {
        h3: 'Connect with others! 🌐',
        h5: 'You can create teams and chat with friends! 💬[ENDLINE] You can also share your boards and tasks with others! ✌️'
    }
    const text4 = {
        h3: 'Cross-platform!',
        h5: 'Try our Discord Brollo Bot!'
    }
    
    return ( 
        <Slider options={{ height: 400, duration:500, indicators:true, interval:10000 }}>
        <ShowcaseItem src="https://image.freepik.com/free-vector/gradient-sharp-lines-abstract-blue-background_23-2148274357.jpg" text={text1} type="center" color="white"/> 
        <ShowcaseItem src="https://image.freepik.com/free-vector/gradient-sharp-lines-abstract-blue-background_23-2148274357.jpg" text={text2} type="left" color="white"/> 
        <ShowcaseItem src="https://image.freepik.com/free-vector/gradient-sharp-lines-abstract-blue-background_23-2148274357.jpg" text={text3} type="right" color="white"/> 
        <ShowcaseItem src="https://image.freepik.com/free-vector/gradient-sharp-lines-abstract-blue-background_23-2148274357.jpg" text={text4} type="center" color="white"/>    
    </Slider> 
    ); 
}
 
export default Showcase