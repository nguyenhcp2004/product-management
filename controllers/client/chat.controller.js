const Chat = require("../../models/chat.model");
const User = require("../../models/user.model");
const uploadToCloudinary = require("../../helpers/upload-to-cloudinary.helper");
module.exports.index = async (req, res) => {
  const userId = res.locals.user.id;
  const fullName = res.locals.user.fullName
  // SocketIO
  _io.once("connection", (socket) => {
    //Người dùng gửi tin nhắn lên server
    socket.on("CLIENT_SEND_MESSAGE", async (data) => {
      const images = []

      for (const image of data.images) {
        const url = await uploadToCloudinary(image)
        images.push(url)
      }
      const chat = new Chat({
        user_id: userId,
        content: data.content,
        images: images
      });

      await chat.save();

      // Trả data ra giao diện realtime
      _io.emit("SERVER_SEND_MESSAGE", {
        userId: userId,
        fullName: fullName,
        content: data.content,
        images: images
      })
    })

    //Typing
    socket.on("CLIENT_SEND_TYPING", (type) => {
      socket.broadcast.emit("SERVER_RETURN_TYPING", {
        userId: userId,
        fullName: fullName,
        type: type
      })
    })
  });
  // End SocketIO

  //Lấy data từ database
  const chats = await Chat.find({
    deleted: false
  })

  for (const chat of chats) {
    const infoUser = await User.findOne({
      _id: chat.user_id
    }).select("fullName")

    chat.infoUser = infoUser;
  }
  //Hết Lấy data từ database
  res.render('client/pages/chat/index', {
    pageTitle: 'Chat',
    chats: chats
  })
} 