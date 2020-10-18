const mongoose = require("mongoose");
import Chatroom from '../../models/chats/chatroom'
//import Chat from '../../models/chats/Chat'
import Message from '../../models/chats/message'
import errorHandler from '../../helpers/dbErrorHandler'
const Chat = require('../../models/chats/Chat')

const createChatroom = async (req, res) => {
  const { name } = req.body;

  const nameRegex = /^[A-Za-z\s]+$/;

  if (!nameRegex.test(name)) throw "Chatroom name can contain only alphabets.";

  const chatroomExists = await Chatroom.findOne({ name });

  if (chatroomExists) throw "Chatroom with that name already exists!";

  const chatroom = new Chatroom({
    name,
  });

  await chatroom.save();

  res.json({
    message: "Chatroom created!",
  });
};

const getMessage = async (req, res) => {
  try {
    let chatroomId  = req.params.chatroomId
    let hostId = req.profile._id
    let results = await Message.find({$and: [
                              { $or: [{sender: hostId}, {receiver: chatroomId}]},
                              { $or: [{sender: chatroomId}, {receiver: hostId}]}
                            ]});

    if(!results) {
      return res.status('400').json({
        error: "Messages not found"
      })
    }

    res.json(results)
  }catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
  })
  }
  
 
}

const getChatroomMessages = async (req, res) => {
  const chatroomId  = req.params.chatroomId
  const hostId = req.params.hostId

  try {
    
    let results = await Chat.findOne({ participants: { $all: [chatroomId, hostId]}})

    if(!results) {
      return res.status('200').json({messages:[]})
    }

    res.json(results)
  }catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
  })
  }
}

const getUserChats = async (req, res) => {
  const userId = req.params.userId

  try{
    let response = await Chat.find({participants: userId})

    res.json(response)
  }catch(err){
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
  })
  }
}

export default {
  createChatroom,
  getMessage,
  getChatroomMessages,
  getUserChats
}