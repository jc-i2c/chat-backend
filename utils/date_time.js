var moment = require("moment");

const dateTime = async () => {
  let data = moment(new Date()).format("DD-MM-YYYY hh:mm:ss A");
  return data;
};

module.exports = { dateTime };
