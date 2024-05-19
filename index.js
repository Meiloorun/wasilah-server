const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const socket = require("socket.io");
const userRoutes = require("./routes/userRoutes");
const messagesRoute = require("./routes/messagesRoute");
const jamaatRoutes = require("./routes/jamaatRoutes");
const groupRoutes = require("./routes/groupRoutes");
const User = require("./models/userModel");

const app = express();
require("dotenv").config();

app.use(cors());
app.use(express.json());

app.use("/api/auth/",userRoutes)
app.use("/api/messages/",messagesRoute)
app.use("/api/jamaats/", jamaatRoutes)
app.use("/api/groups/", groupRoutes)

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Connected to Wasilah Database");
}).catch((err) => {
    console.log(`Failed to connect to Wasilah Database: ${err.message}`)
});

const server = app.listen(process.env.PORT,()=> {
    console.log(`Server Started on Port ${process.env.PORT}`)
})

const io = socket(server,{
    cors: {
        origin:"http://localhost:3000",
        credentials: true,
    },
});

global.onlineUsers = new Map();

global.channelUsers = new Map();

io.on("connection",(socket) => {
    global.chatSocket=socket;
    socket.on("add-user",(userId) => {
        onlineUsers.set(userId, socket.id);
    });

    socket.on("join-channel", (channelId) => {
        if (!channelUsers.has(channelId)) {
            channelUsers.set(channelId, new Set());
        }
        channelUsers.get(channelId).add(socket.id);
        socket.join(channelId);
    });

    socket.on("leave-channel", (channelId) => {
        if (channelUsers.has(channelId)) {
            channelUsers.get(channelId).delete(socket.id);
            if (channelUsers.get(channelId).size === 0) {
                channelUsers.delete(channelId);
            }
        }
        socket.leave(channelId); 
    });

    socket.on("send-msg", async (data) => {
        const sendUserSocket = onlineUsers.get(data.recipient);
    
        const sender = await User.findById(data.sender).select('firstname secondname');
        const messageData = {
          sender: {
            _id: sender._id,
            firstname: sender.firstname,
            secondname: sender.secondname,
          },
          message: data.message,
          channel: data.channel,
        };

        console.log("sendmsg", { messageData });
    
        if (sendUserSocket) {
          socket.to(sendUserSocket).emit("msg-received", messageData);
        }
        if (data.channel) {
          socket.to(data.channel).emit("msg-received", messageData);
        }
      });

    socket.on("disconnect", () => {
        onlineUsers.forEach((value, key) => {
            if (value === socket.id) {
                onlineUsers.delete(key);
            }
        });
        channelUsers.forEach((sockets, channelId) => {
            sockets.delete(socket.id);
            if (sockets.size === 0) {
                channelUsers.delete(channelId);
            }
        });
    });
})