const ChatRoom = require("../models/M_chat_room");
const { dateTime } = require("../utils/date_time");

// Find or Create room users API.
const createRoom = async (req, res, next) => {
  try {
    let { userid, otheruserid } = req.body;

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
      return res.send({
        success: true,
        message: `Chat room already created!`,
        data: findRoom,
      });
    } else {
      let currentDateTime = await dateTime();

      let roomId = Math.floor(100000 + Math.random() * 900000);

      await ChatRoom.create({
        userid: userid,
        otheruserid: otheruserid,
        room_id: roomId,
        created_At: currentDateTime,
        updated_At: currentDateTime,
      });

      return res.send({
        success: true,
        message: `Chat room created successfully!`,
        data: roomId,
      });
    }
  } catch (error) {
    return res.send({
      success: false,
      message: error.message,
    });
  }
};

// Delete users API.
const deleteRoom = async (req, res, next) => {
  try {
    let { room_id } = req.body;

    await ChatRoom.findByIdAndDelete(room_id);

    return res.send({
      success: true,
      message: `Chat room deleted successfully!`,
    });
  } catch (error) {
    return res.send({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createRoom,
  deleteRoom,
};
