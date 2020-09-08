import socket from './socket' 

const updateBoard = async (boardId) => {  
    await new Promise(resolve => setTimeout(resolve, 10))
    socket.emit("update", boardId) 
}

export default updateBoard
