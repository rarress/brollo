import socket from './socket' 

const updateBoard = async (boardId) => {  
    await new Promise(resolve => setTimeout(resolve, 100))
    socket.emit("update", boardId) 
}

export default updateBoard
