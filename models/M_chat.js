const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  chat_room_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Chatroom",
    required: [true, "Chat room Id is required."],
  },
  senderid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: [true, "Customer Id is required."],
  },
  receiverid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: [true, "Service provider Id is required."],
  },
  msgtime: {
    type: String,
  },
  message: {
    type: String,
    required: [true, "Message is required."],
  },
  created_At: {
    type: String,
    required: [true, "Create date is required."],
  },
  updated_At: {
    type: String,
    required: [true, "Update date is required."],
  },
});

chatSchema.methods.toJSON = function () {
  const chat = this;
  const chatObj = chat.toObject();
  delete chatObj.__v;
  return chatObj;
};

module.exports = mongoose.model("Chat", chatSchema);
