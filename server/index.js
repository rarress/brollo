const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const PORT = process.env.PORT || 5000
 

// BD connection
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect(ENV['DB-URL'])
        .then(()=> console.log('MongoDB is successfully connected'))
        .catch(err => console.log(err));

// App init
const app = express()
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'client/build')))

// Backend endpoints
app.get('/api/someApi', (req,res) => { 
});
 
// React endpoints
app.get('*', (req,res) =>{ 
   res.sendFile(path.join(__dirname, '..', '/client/build/index.html'))
});

// Start server
app.listen(PORT, () =>
    console.log(`Server is listening on port ${PORT}`)
)