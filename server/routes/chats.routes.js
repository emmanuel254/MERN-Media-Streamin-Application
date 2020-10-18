import express from 'express'
//const { catchErrors } = require("../helpers/errorHandler");
import chatroomCtrl from '../controllers/chats/chatroom.controller'
//const chatroomController = require("../controllers/chats/chatroom.controller");
import authCtrl from '../controllers/auth.controller'

const router = express.Router()

//router.post("/", authCtrl.requireSignin, catchErrors(chatroomController.createChatroom));
router.route("/api/getallchats/:chatroomId/:hostId")
    .get(chatroomCtrl.getChatroomMessages)

router.route("/api/getuserchats/:userId")
    .get(chatroomCtrl.getUserChats)

export default router;