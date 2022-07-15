const router = require("express").Router();

const users = require("./users");
const chatroom = require("./chat_room");
const chat = require("./chat");

router.use("/users/", users);
router.use("/room/", chatroom);
router.use("/chat/", chat);

module.exports = router;
