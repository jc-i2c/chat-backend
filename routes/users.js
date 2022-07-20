const router = require("express").Router();
const { upload } = require("./../middleware/uploadimage");

const {
  addUsers,
  deleteUsers,
  getAllUsers,
  codeVerify,
} = require("./../controller/C_users");

router.post("/adduser", upload.single("profile_picture"), addUsers);
router.delete("/deleteuser", deleteUsers);
router.get("/allusers", getAllUsers);
router.post("/codeverify", codeVerify);

module.exports = router;
