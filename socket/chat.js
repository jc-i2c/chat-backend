const moment = require("moment");
const axios = require("axios");
const { ObjectId } = require("mongodb");

const User = require("./../models/M_users");
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

    let { chat_room_id, senderid, receiverid, message, filename } = data;

    let currentDateTime = await dateTime();
    let currentTime = moment(new Date()).local().format("hh:mm A");

    let insertData = {
      chat_room_id: chat_room_id,
      senderid: senderid,
      receiverid: receiverid,
      msgtime: currentTime,
      message: message && message,
      filename: filename && filename,
      created_At: currentDateTime,
      updated_At: currentDateTime,
    };

    let insertMsg = await Chat.create(insertData);

    let newMessage = await Chat.findById(insertMsg._id).populate({
      path: "senderid",
      select: "name",
    });

    let messageTemp = message ? message : "FILES";

    let updateData = {
      lastmsg: messageTemp,
      msgtime: currentTime,
    };

    let updateQry = await ChatRoom.findByIdAndUpdate(chat_room_id, updateData, {
      new: true,
    }).lean();

    response = { newMessage, roomId: chat_room_id };

    // Send push notification code.
    // const fcmToken = [
    //   "fTXPrT23Tv2xKj4cUfp5QT:APA91bGwYwN0vcE-DDfZFYHalNFWx0gdXNBXV6wS_wo8R-7Vtjui63Mqn0snA3DA0Gq1KwLDI10v30wWol9coKgBsytdkGAIx3i_SHiOggRgzGAcVbbJ_TKo4DUD7om5aqqKIpa8KiRy",
    // ];

    // const serverKey =
    //   "AAAANKy5iuA:APA91bFum39-_forfH1D5-yimjpmke7C9v1mPyM1-1_tZ8Hz6I9fvEChoKqGps27mh2luSqn3JW5vxQGeRsgRdKgB5S5ENMVEmqeuRhW_OC41pIxbQi75LNO6vy_FgWjdFOV1E7XFhwd";

    // const payload = {
    //   notification: {
    //     title: "Chat notification",
    //     // body: "Hello, How are you?\nI'm Jenish R. Chanchad\nFrom Idea2code infotech LLP Surat.",
    //     body: messageTemp,
    //   },
    //   registration_ids: fcmToken,
    // };

    // const firebaseResponse = await axios.post(
    //   "https://fcm.googleapis.com/fcm/send",
    //   payload,
    //   {
    //     headers: {
    //       Authorization: `Bearer ${serverKey}`,
    //     },
    //   }
    // );

    // console.log(firebaseResponse, "Response from firebase");
    // console.log("working");

    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getAllUsers = async () => {
  try {
    let allUser = await User.find();

    let allUserList = await Promise.all(
      allUser.map(async (user) => {
        let newUrl =
          `${process.env.REACT_APP_PROFILEPIC}` + user.profile_picture;

        let findRoomQry1 = await ChatRoom.findOne({ userid: user._id }).select(
          "lastmsg msgtime"
        );

        let findRoomQry2 = await ChatRoom.findOne({
          otheruserid: user._id,
        }).select("lastmsg msgtime");

        let findRoom = findRoomQry1 ? findRoomQry1 : findRoomQry2;
        let data;
        if (findRoom) {
          data = {
            ...user._doc,
            profile_picture: newUrl,
            lastmsg: findRoom.lastmsg,
            msgtime: findRoom.msgtime,
          };
        } else {
          data = {
            ...user._doc,
            profile_picture: newUrl,
          };
        }
        return data;
      })
    );

    return allUserList;
  } catch (error) {
    throw new Error(error.message);
  }
};

const updateStatus = async (userId) => {
  try {
    let findUser = await User.findById(userId);
    if (findUser.islogin) {
      return await User.findByIdAndUpdate(findUser._id, {
        $set: { islogin: false },
      });
    } else {
      return await User.findByIdAndUpdate(findUser._id, {
        $set: { islogin: true },
      });
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

const getChatingUser = async (currentUserId) => {
  try {
    let findRoom = [];
    let find1 = await ChatRoom.find({
      userid: currentUserId,
    });

    let find2 = await ChatRoom.find({
      otheruserid: currentUserId,
    });

    if (find1.length > 0) {
      find1.forEach((find1Item) => {
        findRoom.push(find1Item);
      });
    }
    if (find2.length > 0) {
      find2.forEach((find2Item) => {
        findRoom.push(find2Item);
      });
    }

    if (findRoom.length > 0) {
      let userList = [];
      let finalRoom = await Promise.all(
        findRoom.map(async (item) => {
          let userOneByOne = item.toObject();
          let userIds = "";
          let found1 = userList.some((el) => el == userOneByOne.userid);

          if (!found1) {
            userList.push(userOneByOne.userid.toString());
            userIds = userOneByOne.userid.toString();
          }

          let found2 = userList.some((el) => el == userOneByOne.otheruserid);

          if (!found2) {
            userList.push(userOneByOne.otheruserid.toString());
            userIds = userOneByOne.otheruserid.toString();
          }

          let roomId = userOneByOne._id;
          delete userOneByOne._id;
          delete userOneByOne.room_id;
          delete userOneByOne.userid;
          delete userOneByOne.otheruserid;
          delete userOneByOne.created_At;
          delete userOneByOne.updated_At;
          delete userOneByOne.__v;
          userIds = ObjectId(userIds);

          let findUsers = await User.findById(userIds);

          let finalData = {};
          if (findUsers != null) {
            let newUrl =
              `${process.env.REACT_APP_PROFILEPIC}` + findUsers.profile_picture;
            finalData = {
              ...userOneByOne,
              roomid: roomId,
              _id: findUsers._id,
              name: findUsers.name,
              profile_picture: newUrl && newUrl,
            };
          }

          return finalData;
        })
      );
      return finalRoom;
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  createRoom,
  getAllMessage,
  sendMessage,
  getAllUsers,
  updateStatus,
  getChatingUser,
};
