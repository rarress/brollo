const registerController = require('../controllers/registerController')

module.exports = app => {
    app.post('/api/register', registerController.register)
}