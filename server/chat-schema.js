'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const chatSchema = new Schema ({
  User_Message: {
    type: String
  },
  username: {
    type: String
  },
  privateReceiver: {
    type: String
  },
});

let Chat = mongoose.model('Chat', chatSchema);

// Configuring the schema to be exported, all the messages are constructed as strings
module.exports = Chat;
