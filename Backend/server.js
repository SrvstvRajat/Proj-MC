const express=require('express');
require("dotenv").config();
const { connectDB } = require('./db');
var cors = require('cors')
const app=express();
const http = require('http');
const Msg = require('./model/message');
const { Server } =require('socket.io')
const server=http.createServer(app);
app.use(express.json());
app.use(cors())

connectDB();    



const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });
  
  app.use(
    cors({
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
    })
  );
  


io.on('connection', async(socket) => {
    const msg=await Msg.find();
    if(msg)
    {
        const array_name=[];
        for (var i = 0; i < msg.length; i++) {
            array_name.push(msg[i].msg)
            // some code
          }
        io.emit('message', array_name)
    }
    console.log('a user connected');
    socket.emit('message', 'Hello world');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
    socket.on('user-message', msg => {
        const message = new Msg({ msg });
        message.save().then(() => {
            io.emit('message', msg)
        })
    })
})




server.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
  });

app.get("/",
    (req, res) => {
        res.sendFile(__dirname + "/client-side.html");
    });
 


