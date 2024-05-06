const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const socket = require("socket.io");
const userRoutes = require("./routes/userRoutes");
const messagesRoute = require("./routes/messagesRoute");
const jamaatRoutes = require("./routes/jamaatRoutes");
const groupRoutes = require("./routes/groupRoutes");

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

io.on("connection",(socket) => {
    global.chatSocket=socket;
    socket.on("add-user",(userId) => {
        onlineUsers.set(userId, socket.id);
    });

    socket.on("send-msg", (data) => {
        console.log("sendmsg", { data });
        const sendUserSocket = onlineUsers.get(data.recipient);
        if(sendUserSocket) {
            socket.to(sendUserSocket).emit("msg-received", data.message);
        }
    })
})