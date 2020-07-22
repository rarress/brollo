const registerController = require('../controllers/registerController')
const loginController = require('../controllers/loginController')
const verifyUserController = require('../controllers/verifyUserController')
const checkToken = require('../controllers/checkToken')
const friendsController = require('../controllers/friendsController')

module.exports = app => {
    app.get('/api/verifyUser', verifyUserController.checkAuth)
    app.post('/api/checkToken' , checkToken)
    app.post('/api/register', registerController.register)
    app.post('/api/login', loginController)
    app.post('/api/addFriend/:user', friendsController.addFriend)
}