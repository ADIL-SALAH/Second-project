const express = require('express')
const app = express()
const mongoose = require('mongoose')
const userRoute = require('../Server/routes/userRoutes')
const restoRoute = require('../Server/routes/restoRoutes')
const cors = require('cors')
const dotenv = require('dotenv');
const adminRoute = require('../Server/routes/adminRoutes')
const path = require('path')
dotenv.config();

const { storeMessages } = require('./controller/chatController')

const http = require('http').Server(app);
const socketIO = require('socket.io')(http, {
  cors: {
    origin: "http://localhost:5173"
  }
});
socketIO.on('connection', (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);
  socket.on("setup", (chatId) => {
    console.log(chatId, '22222222');
    socket.join(chatId);
  });

  socket.on('message', (data) => {
    console.log(data, '9999999999');
    storeMessages(data)
    socket.on('typing', (data) => { socket.broadcast.emit('typingResponse', data) });
    console.log(data + 'oneeeeeeeeeeee')
    socketIO.emit('messageResponse', data);
  });
  socket.on('disconnect', () => {
    console.log(`🔥: ${socket.id} A user disconnected`);
  });
});

app.use(express.json())
app.use(cors({ origin: 'http://localhost:5173' }))
mongoose.connect(process.env.mongo_connection_string)
  .then((res) => console.log('mongodb connected...'))
  .catch((err) => console.log(err));
app.use('/', express.static(path.join(__dirname, '/public')));




app.use('/', userRoute)
app.use('/resto', restoRoute)
app.use('/admin', adminRoute)

const port = process.env.PORT
http.listen(port, () => {
  console.log('server is running..')
})
