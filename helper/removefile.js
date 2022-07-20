const fs = require("fs");

const removeFile = (data) => {
  try {
    const filepath = "./uploads/" + data;

    if (Array.isArray(data)) {
      data.map((images) => {
        const filepath = "./uploads/" + images;
        fs.unlink(filepath, function (err) {
          if (err) return console.log(err);
        });
      });
    } else {
      // Delete file here if error occurred.
      fs.unlink(filepath, function (err) {
        if (err) return console.log(err);
      });
    }
  } catch (error) {
    // console.log(error);
    throw error;
  }
};

module.exports = { removeFile };
