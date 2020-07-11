const apiController = require('../controllers/apiController')

module.exports = app => {
    app.get('/api/random', apiController.random), 
    app.post('/api/register', apiController.register)
}