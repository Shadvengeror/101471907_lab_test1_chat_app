const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
const GroupMessage = require("./models/GroupMessage");

mongoose.connect("mongodb://127.0.0.1:27017/chat_app")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(cors());
app.use(express.json());
app.use(express.static("public"));
const authRoutes = require("./routes/auth");
app.use("/api", authRoutes);

// Basic route
app.get("/", (req, res) => {
    res.send("Chat Server is Running...");
});

// Socket connection
io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Join Room
    socket.on("joinRoom", async ({ username, room }) => {
        socket.join(room);

        const messages = await GroupMessage.find({ room });
        socket.emit("previousMessages", messages);
    });

    // Leave Room
    socket.on("leaveRoom", (room) => {
        socket.leave(room);
    });

    // Chat Message
    socket.on("chatMessage", async ({ room, username, message }) => {
        const newMessage = new GroupMessage({
            from_user: username,
            room: room,
            message: message
        });

        await newMessage.save();

        io.to(room).emit("message", {
            username,
            message
        });
    });

    // Typing Indicator (IMPORTANT: MUST BE INSIDE)
    socket.on("typing", ({ room, username }) => {
        socket.to(room).emit("typing", username);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });

    socket.on("typing", ({ room, username }) => {
    socket.to(room).emit("typing", username);
});
});



const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});


