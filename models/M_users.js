const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema({
  email_address: {
    type: String,
    trim: true,
    index: true,
    lowercase: true,
    validate: {
      validator: function (v) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: "Please enter valid email address.",
    },
    required: [true, "Email address is required."],
    unique: [true, "Email address is already exists."],
  },
  name: { type: String, required: [true, "Name is required."] },
  user_id: { type: Number, required: [true, "User Id is required."] },
  created_At: {
    type: String,
    required: [true, "Create date is required."],
  },
  updated_At: {
    type: String,
    required: [true, "Update date is required."],
  },
});

usersSchema.methods.toJSON = function () {
  const users = this;
  const usersObj = users.toObject();
  delete usersObj.__v;
  return usersObj;
};

module.exports = mongoose.model("Users", usersSchema);
