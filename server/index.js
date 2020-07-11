const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const mongoose = require('mongoose') 
const PORT = process.env.PORT || 5000
 

// BD connection
let mongodb_url
if (process.env.DB_URL === undefined)
    mongodb_url = require('./mongodb_url_secret')
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect(process.env.DB_URL || mongodb_url)
        .then(()=> console.log('MongoDB is successfully connected'))
        .catch(err => console.log(err));

// App init
const app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, '..', 'client', 'build')))

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