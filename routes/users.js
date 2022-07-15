const router = require("express").Router();

const {
  addUsers,
  deleteUsers,
  getAllUsers,
  codeVerify,
} = require("./../controller/C_users");

router.post("/adduser", addUsers);
router.delete("/deleteuser", deleteUsers);
router.get("/allusers", getAllUsers);
router.post("/codeverify", codeVerify);

module.exports = router;
