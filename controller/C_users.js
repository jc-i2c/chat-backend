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

    let newUser = await User.create({
      email_address: email_address,
      name: name,
      profile_picture: userProfile,
      created_At: currentDateTime,
      updated_At: currentDateTime,
    });

    return res.send({
      success: true,
      message: `User created.`,
      data: newUser,
    });
  } catch (error) {
    // Mongoose validation.
    if (req.file) {
      removeFile(req.file.filename);
    }

    let errorMsg = "";
    if (error.code === 11000) {
      if (error.keyValue.email_address)
        errorMsg = `${error.keyValue.email_address} email address is already exists!`;
    } else {
      errorMsg = error.message;
    }

    // if (error.errors.profile_picture === "ValidatorError") {
    //   console.log(error.errors.profile_picture, "error.errors.profile_picture");
    //   errorMsg = "Profile picture is required!";
    // }

    return res.send({
      success: false,
      message: errorMsg,
    });
  }
};

// Delete users API.
const deleteUsers = async (req, res, next) => {
  try {
    let { email_address } = req.body;
    let finduser = await User.findOne({ email_address: email_address });

    if (finduser != null || finduser != undefined || finduser) {
      await User.findByIdAndDelete(finduser._id);
      removeFile(finduser.profile_picture);
    } else {
      throw new Error(`Couldn't find user!`);
    }

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
    let { email_address } = req.body;

    if (!email_address) throw new Error("Email address is required!");

    let findUser = await User.findOne({ email_address: email_address });

    if (!findUser) throw new Error("Wrong credentials!");

    let userData = findUser.toObject();

    let newUrl =
      `${process.env.REACT_APP_PROFILEPIC}` + userData.profile_picture;

    delete userData.__v;
    userData = { ...userData, profile_picture: newUrl };

    return res.send({
      success: true,
      message: `User login in successfully!`,
      data: userData,
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
