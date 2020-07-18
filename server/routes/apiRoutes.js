const registerController = require('../controllers/registerController')
const verifyUserController = require('../controllers/verifyUserController')

module.exports = app => {
    app.post('/api/register', registerController.register),
    app.get('/api/verifyUser', verifyUserController.checkAuth)
}