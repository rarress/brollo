const jwt = require('jsonwebtoken');
let secret = require('../secrets/jwt-token') || process.env.jwt_secret

module.exports = checkToken = (req, res) => {
    const token = req.cookies.access_token

    if (token)
        jwt.verify(token, secret, (err, user) => {
            if (err) res.json({error:true})
            res.json(user)
        })
    else res.json({ error: true })

}
