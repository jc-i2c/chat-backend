const router = require("express").Router();

const { craeteChat, deleteChat } = require("../controller/C_chat");

router.post("/create", craeteChat);
router.delete("/delete", deleteChat);

module.exports = router;
