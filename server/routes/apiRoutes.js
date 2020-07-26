const registerController = require('../controllers/registerController')
const loginController = require('../controllers/loginController')
const verifyUserController = require('../controllers/verifyUserController')
const checkToken = require('../controllers/checkToken')
const friendsController = require('../controllers/friendsController')

module.exports = app => {
    //COSMIN
    app.get('/api/verifyUser', verifyUserController.checkAuth)
    app.post('/api/register', registerController.register)
    app.post('/api/addFriend/:user', friendsController.add)
    app.post('/api/acceptFriend/:user', friendsController.accept)

    //For testing to be removed
    app.get('/api/random', async (req, res) => {
        await new Promise(r => setTimeout(r, 5000));
        res.send("random")
    })

    //RARES
    app.post('/api/checkToken' , checkToken)
    app.post('/api/login', loginController)

}