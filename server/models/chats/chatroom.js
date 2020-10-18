import mongoose from 'mongoose'

const chatroomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: "Name is required!",
  },
});

export default mongoose.model('Chatroom', chatroomSchema)