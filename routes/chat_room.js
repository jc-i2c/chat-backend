const router = require("express").Router();

const { createRoom, deleteRoom } = require("../controller/C_chat_room");

router.post("/create", createRoom);
router.delete("/delete", deleteRoom);

module.exports = router;
