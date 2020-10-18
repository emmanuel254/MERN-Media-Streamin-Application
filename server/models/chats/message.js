const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  chatroom: {
    type: mongoose.Schema.Types.ObjectId,
    required: "Chatroom is required!",
    ref: "Chatroom",
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    required: "Sender is required!",
    ref: "User",
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    required: "Receiver is required!",
    ref: "User",
  },
  message: {
    type: String,
    required: "Message is required!",
  },
}, {
  timestamps : true
});

module.exports = mongoose.model("Message", messageSchema);