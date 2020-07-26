const registerController = require('../controllers/registerController')
const loginController = require('../controllers/loginController')
const verifyUserController = require('../controllers/verifyUserController')
const checkToken = require('../controllers/checkToken')
const friendsController = require('../controllers/friendsController')
const boardsController = require('../controllers/boardsController')

module.exports = app => {
    //COSMIN
    app.get('/api/verifyUser', verifyUserController.checkAuth)
    app.post('/api/register', registerController.register)
    app.post('/api/addFriend/:user', friendsController.add)
    app.post('/api/acceptFriend/:user', friendsController.accept)
    app.post('/api/boards', boardsController.create)
    app.get('/api/boards/:id/user/:user', boardsController.getUserInfo)
    app.get('/api/boards/:id', boardsController.read)
    app.post('/api/boards/find', boardsController.find)
    app.delete('/api/boards/:id', boardsController.delete)

    //For testing to be removed (heavy loading api)
    app.get('/api/heavyLoading', async (req, res) => {
        await new Promise(resolve => setTimeout(resolve, 5000));
        res.send("some big data loaded!")
    })

    //RARES
    app.post('/api/checkToken' , checkToken)
    app.post('/api/login', loginController)

}