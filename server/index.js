const express = require('express')
const http = require("http")
const path = require('path')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose') 
const PORT = process.env.PORT || 5000

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

// Backend endpoints
const apiRoutes = require('./routes/apiRoutes.js')(app)
 
// React endpoints
app.get('*', (req,res) =>{ 
   res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'))
});

// Setting up server and socket.io
const server = http.createServer(app);
const io = require('socket.io').listen(server)

io.on("connection", (socket) => {
    socket.on("join", (board) => {
        socket.join(board)
    })

    socket.on("update", async (board) => { 
        io.to(board).emit("update")
    })
});

// Start server
server.listen(PORT, () =>
    console.log(`Server is listening on port ${PORT}`)
)