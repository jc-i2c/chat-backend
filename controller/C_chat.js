const Chat = require("../models/M_chat");
const { dateTime } = require("../utils/date_time");

// Create chat API.
const craeteChat = async (req, res, next) => {
  try {
    let { chat_room_id, senderid, receiverid, message } = req.body;

    let currentDateTime = await dateTime();

    await Chat.create({
      chat_room_id: chat_room_id,
      senderid: senderid,
      receiverid: receiverid,
      msgtime: currentDateTime,
      message: message,
      created_At: currentDateTime,
      updated_At: currentDateTime,
    });

    return res.send({
      success: true,
      message: `Chat created successfully!`,
    });
  } catch (error) {
    return res.send({
      success: false,
      message: error.message,
    });
  }
};

// Delete chat API.
const deleteChat = async (req, res, next) => {
  try {
    let { chat_id } = req.body;

    await Chat.findByIdAndDelete(chat_id);

    return res.send({
      success: true,
      message: `Chat deleted successfully!`,
    });
  } catch (error) {
    return res.send({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  craeteChat,
  deleteChat,
};
