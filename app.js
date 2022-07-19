const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const http = require("http");
const server = http.createServer(app);
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const { Server } = require("socket.io");

require("dotenv").config();
const port = process.env.API_PORT || 5001;

const filePath = path.resolve(__dirname + "/uploads");

if (!fs.existsSync(filePath)) {
  fs.mkdirSync(filePath);
}

// configuration of cors
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

require("./server/database")
  .connect()
  .then(async (data) => {
    app.use(express.json());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.use("/static", express.static("./index.html"));

    app.use("/uploads", express.static("./uploads"));

    app.use("/static", express.static("./src/user"));

    app.use(require("./routes/"));
  })
  .catch((error) => {
    console.log(error, "Error");
  });

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

let {
  createRoom,
  getAllMessage,
  sendMessage,
  getAllUsers,
  updateStatus,
} = require("./socket/chat");

io.on("connection", (socket) => {
  // Find or Create room users SOCKET CALL.
  socket.on("findRoomEmit", async (data) => {
    try {
      let resData = await createRoom(data);
      socket.emit("findRoomOn", resData);
    } catch (error) {
      console.log(error.message);
    }
  });

  // Get all message SOCKET.
  socket.on("getAllMessageEmit", async (roomId) => {
    try {
      let currentRoomId = roomId;

      socket.join(roomId);

      let allChatList = await getAllMessage(roomId);

      io.to(currentRoomId).emit("getAllMessageOn", allChatList);
    } catch (error) {
      console.log(error.message);
    }
  });

  // Send message SOCKET.
  socket.on("sendMessageEmit", async (data) => {
    try {
      let dataToSave = data;
      if (dataToSave?.file) {
        // process image
        const image = data.file;
        var splitted = image.split(";base64,");
        var format = splitted[0].split("/")[1];

        var fileName = Date.now() + "." + format;
        var imagePath = "./uploads/" + fileName;

        fs.writeFileSync(imagePath, splitted[1], {
          encoding: "base64",
        });
        dataToSave = { ...dataToSave, filename: fileName };
      }

      let { newMessage, roomId } = await sendMessage(dataToSave);
      io.to(roomId).emit("sendMessageOn", newMessage);
    } catch (error) {
      console.log(error.message);
    }
  });

  // Get all user list SOCKET.
  socket.on("userListEmit", async () => {
    try {
      let userList = await getAllUsers();
      socket.emit("userListOn", userList);
    } catch (error) {
      console.log(error.message);
    }
  });

  // User online SOCKET.
  socket.on("changeStatusEmit", async (userId) => {
    try {
      await updateStatus(userId);

      socket.emit("updateUserEmit", userId);
    } catch (error) {
      console.log(error.message);
    }
  });
});

server.listen(port, () => console.log(`Server app listening on port: ${port}`));
