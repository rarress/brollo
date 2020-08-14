const registerController = require('../controllers/registerController')
const loginController = require('../controllers/loginController')
const verifyUserController = require('../controllers/verifyUserController')
const checkToken = require('../controllers/checkToken') 
const boardsController = require('../controllers/boardsController')
const teamsController = require('../controllers/teamsController')
const forgotPassword = require('../controllers/forgotPassController')
module.exports = app => {
    //COSMIN
    // app.post('/api/addFriend/:user', friendsController.add) -- REMOVED
    // app.post('/api/acceptFriend/:user', friendsController.accept) -- REMOVED
    app.get('/api/verifyUser', verifyUserController.checkAuth)
    app.post('/api/register', registerController.register)

    app.post('/api/boards', boardsController.create)
    app.get('/api/boards', boardsController.find)
    app.get('/api/boards/:id', boardsController.read)
    app.get('/api/boards', boardsController.find) //(uses qs, find by board name, member name or both)
    app.get('/api/boards/:id/user/:user', boardsController.getUserInfo) 
    app.patch('/api/boards/:id', boardsController.update)
    app.delete('/api/boards/:id', boardsController.delete)
    
    app.post('/api/teams', teamsController.create)
    app.get('/api/teams/:id', teamsController.read)
    app.get('/api/teams', teamsController.find) //(uses qs, find by team name, member name or both)
    app.put('/api/teams/:id', teamsController.addUser)
    app.get('/api/teams/:id/leader', teamsController.readLeader)
    app.patch('/api/teams/:id/leader', teamsController.changeTeamLeader)
    app.delete('/api/teams/:id/user/:user', teamsController.deleteUser)
    app.delete('/api/teams/:id', teamsController.delete)

    //For testing to be removed (heavy loading api)
    app.get('/api/heavyLoading', async (req, res) => {
        await new Promise(resolve => setTimeout(resolve, 5000));
        res.send("some big data loaded!")
    })

    //RARES
    app.post('/api/verifyUser/resend', verifyUserController.resendMail)
    app.post('/api/checkToken' , checkToken)
    app.post('/api/login', loginController)
    app.post('/api/forgotPassword',forgotPassword.verifyMail)
    app.post('/api/forgotPassword/verify',forgotPassword.checkToken)
    app.post('/api/forgotPassword/change',forgotPassword.changePass)
}