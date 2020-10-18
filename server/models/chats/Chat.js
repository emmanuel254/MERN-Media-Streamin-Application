const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const chatSchema = new Schema(
  {
    participants: [
        mongoose.Schema.Types.ObjectId,
        ref = "User"
    ],
    messages: [{
      message_text: String,
      sender_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: "Sender is required!",
        ref: "User",
      },
      receiver_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: "Receiver is required!",
        ref: "User",
      },
      created: {
        type: Date,
        default: Date.now
      },
      read: {
          type: Boolean,
          default: false
      }
    }]
  },
  {
    timestamps: true
  }
);

let Chat = mongoose.model("theChat", chatSchema);

module.exports = Chat;