const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose') 
const PORT = process.env.PORT || 5000
const cookieParser = require('cookie-parser')

// BD connection
mongoose.set('useNewUrlParser', true)
mongoose.set('useUnifiedTopology', true)
mongoose.set('useFindAndModify', false)
mongoose.connect(process.env.DB_URL? process.env.DB_URL : require('./secrets/mongodb_url_secret'))
        .then(()=> console.log('MongoDB is successfully connected'))
        .catch(err => console.log(err))

// App init
const app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(express.static(path.join(__dirname, '..', 'client', 'build')))
app.use(cookieParser())

// Backend endpoints
const apiRoutes = require('./routes/apiRoutes.js')(app)
 
// React endpoints
app.get('*', (req,res) =>{ 
   res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'))
});

// Start server
app.listen(PORT, () =>
    console.log(`Server is listening on port ${PORT}`)
)