var moment = require("moment");

const ChatRoom = require("../models/M_chat_room");
const Chat = require("../models/M_chat");

const { dateTime } = require("../utils/date_time");

// Find or Create room users API.
const createRoom = async (data) => {
  try {
    let { userid, otheruserid } = data;

    let findRoomFirst = await ChatRoom.findOne({
      userid: userid,
      otheruserid: otheruserid,
    });

    let findRoomSecond = await ChatRoom.findOne({
      userid: otheruserid,
      otheruserid: userid,
    });

    let findRoom = findRoomFirst ? findRoomFirst : findRoomSecond;

    if (findRoom) {
      return findRoom._id;
    } else {
      let currentDateTime = await dateTime();

      let roomId = Math.floor(100000 + Math.random() * 900000);

      let createNewRoom = await ChatRoom.create({
        userid: userid,
        otheruserid: otheruserid,
        room_id: roomId,
        created_At: currentDateTime,
        updated_At: currentDateTime,
      });

      return createNewRoom._id;
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

// Find or Create room users API.
const getAllMessage = async (roomId) => {
  try {
    let findAllMessage = await Chat.find({ chat_room_id: roomId }).populate({
      path: "senderid",
      select: "name",
    });

    if (findAllMessage.length > 0) return findAllMessage;
    else return [];
  } catch (error) {
    throw new Error(error.message);
  }
};

// Send Message API.
const sendMessage = async (data) => {
  try {
    let roomId = null;
    let response = {};

    let { chat_room_id, senderid, receiverid, message } = data;
    let currentDateTime = await dateTime();

    let currentTime = moment(new Date()).format("hh:mm:ss A");

    let insertMsg = await Chat.create({
      chat_room_id: chat_room_id,
      senderid: senderid,
      receiverid: receiverid,
      msgtime: currentTime,
      message: message,
      created_At: currentDateTime,
      updated_At: currentDateTime,
    });

    let newMessage = await Chat.findById(insertMsg._id).populate({
      path: "senderid",
      select: "name",
    });

    response = { newMessage, roomId: chat_room_id };

    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = { createRoom, getAllMessage, sendMessage };
