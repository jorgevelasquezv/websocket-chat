const { Socket } = require('socket.io');
const { checkJWT } = require('../helpers');
const { ChatMessages } = require('../models');

const chatMessage = new ChatMessages();

const socketController = async (socket = new Socket(), io) => {

    const token = socket.handshake.headers['x-token'];
    
    const user = await checkJWT(token);

    if (!user) {
        return socket.disconnect();
    }

    // Add connected user
    chatMessage.connectUser(user);
    io.emit('active-users', chatMessage.usersArr);
    socket.emit('message-received', chatMessage.last10);

    //Connect to a private room
    socket.join(user.id); // global, socket.id, user.id 

    // Remove disconnected user
    socket.on('disconnect', () => {
        chatMessage.disconnectUser(user.id);
        io.emit('active-users', chatMessage.usersArr);
    });

    // Listen messages
    socket.on('send-message', ({ uid, message }) => {
        console.log(uid, message);
        if (uid) {
            // Private message
            socket.to(uid).emit('private-message', { from: user.name, message });
        } else {
            chatMessage.sendMessage(user.id, user.name, message);
            io.emit('message-received', chatMessage.last10);
        }
    });
};

module.exports = {
    socketController,
};
