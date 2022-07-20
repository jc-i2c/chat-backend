const User = require("./../models/M_users");
const { dateTime } = require("./../utils/date_time");
const { removeFile } = require("./../helper/removefile");

// add users API.
const addUsers = async (req, res, next) => {
  try {
    let { email_address, name } = req.body;

    if (req.file) {
      var userProfile = req.file.filename;
    }

    let currentDateTime = await dateTime();

    let userId = Math.floor(100000 + Math.random() * 900000);

    await User.create({
      email_address: email_address,
      name: name,
      profile_picture: userProfile,
      user_id: userId,
      created_At: currentDateTime,
      updated_At: currentDateTime,
    });

    return res.send({
      success: true,
      message: `User created. Id is ${userId}`,
      data: userId,
    });
  } catch (error) {
    // Mongoose validation.
    let errorMsg = "";
    if (error.code === 11000) {
      if (error.keyValue.email_address)
        errorMsg = `${error.keyValue.email_address} email address is already exists!`;
    } else {
      errorMsg = error.message;
    }

    if (req.file) {
      removeFile(req.file.filename);
    }

    return res.send({
      success: false,
      message: errorMsg,
    });
  }
};

// Delete users API.
const deleteUsers = async (req, res, next) => {
  try {
    let { user_id } = req.body;

    await User.findByIdAndDelete(user_id);

    return res.send({
      success: true,
      message: `User deleted successfully!`,
    });
  } catch (error) {
    return res.send({
      success: false,
      message: error.message,
    });
  }
};

// Get all users API.
const getAllUsers = async (req, res, next) => {
  try {
    let findUsers = await User.find();

    return res.send({
      success: true,
      message: `User list!`,
      data: findUsers,
    });
  } catch (error) {
    return res.send({
      success: false,
      message: error.message,
    });
  }
};

// Users code verify API.
const codeVerify = async (req, res, next) => {
  try {
    let { user_code } = req.body;

    if (!user_code) throw new Error("User code is required!");

    let findUser = await User.findOne({ user_id: user_code });

    if (!findUser) throw new Error("wrong credentials!");

    return res.send({
      success: true,
      message: `user login in successfully!`,
      data: findUser,
    });
  } catch (error) {
    return res.send({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  addUsers,
  deleteUsers,
  getAllUsers,
  codeVerify,
};
