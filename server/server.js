import config from './../config/config'
import app from './express'
import mongoose from 'mongoose'
import User from './models/user.model'
// import jwt from 'express-jwt'
// import jsonwebtoken from 'jsonwebtoken'

// Connection URL
mongoose.Promise = require('bluebird')
mongoose.connect(config.mongoUri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
mongoose.connection.on('error', () => {
  throw new Error(`unable to connect to database: ${config.mongoUri}`)
})



const server = app.listen(config.port, (err) => {
    if (err) {
      console.log(err)
    }
    console.info('Server started on port %s.', config.port)
  })

const io = require('socket.io')(server)

const Chat = require('./models/chats/Chat')
const ChatRoom = require('./models/chats/chatroom')
const Message = require('./models/chats/message')
const jwtThen = require("jwt-then")

io.use(async (socket, next) => {
  try {
    const token = socket.handshake.query.token;
    const payload = await jwtThen.verify(token, config.jwtSecret);
    socket.userId = payload._id;
    next()
  }catch(err){
    console.log('Error occured: '+err)
  }
});

const updateUserStatus = async (userId) => {
  const user = await User.findByIdAndUpdate(userId, {status: 'online', updated: Date.now()}, {new : true})
  // Remove confidential details
  user.hashed_password = undefined
  user.salt = undefined

  let response = user.toJSON()
  io.to(userId).emit("updateUserStatus", response)
  let broadcastMessage = {
      _id : response._id,
      status: response.status,
      updated: response.updated
  }

  io.emit("updateMembersStatus", broadcastMessage)
}

io.on("connection", (socket) => {
  console.log("User Connected: "+socket.userId);

  updateUserStatus(socket.userId)

  socket.on("disconnect", async function(){
    const user = await User.findByIdAndUpdate(socket.userId, {status: 'offline', updated: Date.now()}, {new : true})

    let response = user.toJSON()
    io.to(socket.userId).emit("updateUserStatus", response)
    let broadcastMessage = {
      _id : response._id,
      status: response.status,
      updated: response.updated
    }

    io.emit("updateMembersStatus", broadcastMessage)
    console.log("user disconnected")
  })

  socket.on("chat message", ({message}) => {
    console.log("Message Received: "+message)
    socket.broadcast.emit("received", {message: message})

    let chatMessage = new Chat({message: message, sender: "Anonymous"})

    chatMessage.save()
  })

  socket.on("joinRoom", async ({chatroomId}) => {
    socket.join(chatroomId)
    
    console.log("A user joined chatroom: "+broadcastMessage.status)
  })

  socket.on("leaveRoom", async ({chatroomId}) => {
    socket.leave(chatroomId)
    
    console.log("A user left chatroom: " + chatroomId);
  })

  socket.on("chatroomMessage", async ({chatroomId,sender, receiver, message}) => {
    if(message.trim().length > 0)
    {
      const chatexists = await Chat.findOne({ participants: { $all: [receiver, sender]}})
      const message_data = {
                          message_text: message,
                          sender_id: sender,
                          receiver_id: receiver
                        }
      let newChat;
      let response;

      if(!chatexists)
      {
         newChat = new Chat({
          participants: [sender, receiver],
          messages : message_data
        })
        response = await newChat.save()
      }
      else
      {
         response = await Chat.findByIdAndUpdate(chatexists._id,{$push: {messages : message_data}},{new: true})
      }

      let data = await Chat.find({participants: receiver})
      
      let res= response.toJSON()

      io.to(sender).emit("newMessage", res)
      io.to(receiver).emit("newMessage", res)
      io.to(receiver).emit("updateChats", data)
    }
  })

  //Someone is typing
  socket.on("typing", data => {
    console.log(data.user+' is '+data.message)
    // socket.broadcast.emit("notifyTyping", {
    //   user: data.user,
    //   message: data.message
    // });
  });
})