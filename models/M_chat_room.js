const mongoose = require("mongoose");

const chatRoomSchema = new mongoose.Schema({
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: [true, "User Id is required."],
  },
  otheruserid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: [true, "Other user Id is required."],
  },
  room_id: { type: Number, required: [true, "Room Id is required."] },
  sendby: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
  lastmsg: {
    type: String,
    default: "Now you can chat with each other",
  },
  msgtime: {
    type: String,
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

chatRoomSchema.methods.toJSON = function () {
  const chatRoom = this;
  const chatRoomObj = chatRoom.toObject();
  delete chatRoomObj.__v;
  return chatRoomObj;
};

module.exports = mongoose.model("Chatroom", chatRoomSchema);
