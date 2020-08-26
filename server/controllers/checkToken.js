const jwt = require('jsonwebtoken');
let secret = process.env.JWT_SECRET || require('../secrets/jwt-token')

module.exports = checkToken = (req, res) => {
    const token = req.cookies.access_token
    if (token)
        jwt.verify(token, secret, (err, user) => {
            if (err) res.json({ error: true })
            res.json(user)
        })
    else res.json({ error: true })
}
