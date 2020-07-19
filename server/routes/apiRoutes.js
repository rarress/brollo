const registerController = require('../controllers/registerController')
const loginController = require('../controllers/loginController')
module.exports = app => {
    app.post('/api/register', registerController.register)
    app.post('/api/login' , loginController )
}