'use strict';

const socket = require('socket.io-client')(process.env.PORT || 'http://localhost:3000');
const repl = require('repl');
const chalk = require('chalk');
const chalkAnimation = require('chalk-animation');
const gradient = require('gradient-string');
const { argv, emit } = require('process');

var username = null;

socket.on('connect', () => {
  username = process.argv[2];

  var string = `Hello ${username}, welcome to the chat!`;

  figlet(string, function (error, data) {
    if (error) {
      chalkAnimation.neon('Sorry something went wrong...');
      console.dir(error);
      return;
    }
    console.log(gradient.rainbow(data));
    console.log(chalk.magentaBright('-----Instructions for Chat-----'));
    console.log(chalk.cyan('** Enter message to send globally'));
    console.log(chalk.cyan('** Enter /to (user) to send a private Message'));
    console.log(chalk.magentaBright('-------------------------------'));
  })

  console.log(chalk.magentaBright('-----Chatty Kathie-----'));
})

socket.on('disconnect', () => {
  console.log(`User ${username}, left the chatroom`)
});

socket.on('message', (data) => {
  const { User_Message, username } = data;
  console.log(chalk.green(username + ':' + User_Message.split('\n')[0]));
  socket.emit('chat message', data);
});

socket.on('private message', (data) => {
  const { User_Message, username } = data;
  console.log(chalk.red(username + ':' + User_Message.split('\n')[0]));
  socket.emit('chat message', data);
});

socket.on('message list', (data) => {
  data.allMessages.forEach((chatMessage) => {
    const { User_Message, username } = chatMessage;
    // Creating the edge case for if the user's message is intended to be sent privately
    if (!chatMessage.privateReceiver) {
      console.log(chalk.red(username + ':' + User_Message.split('\n')[0]));
    } 
    // Otherwise if the username matches the data of the current user or the data matches the private receiver then we console lof the results 
    else {
      if (username === data.currentUser || data.currentUser === chatMessage.privateReceiver) {
        console.log(chalk.yellow(username + ':' + User_Message.split('\n')[0]));
      };
    };
  });
});

repl.start({
  prompt: '',
  eval: (User_Message) => {
    
    // Our first conditional for the regex to filter the private messages, the users message would need to match the first regex
    let regex1 = /(\S+\w+\s+){2}/gm;
    let regex1String = User_Message.match(regex1);

    let messageConstructor = User_Message.split('');
    let messageType = messageConstructor[0];

    let privateReceiver = null;
    // creating the edge case for the private receiver to match the message type with the key of "/to"
    if(messageType === '/to') {
      socket.emit('private message', { username, User_Message, privateReceiver, messageType });
    }
    // otherwise we can emit the messages any users send
    else {
      socket.emit('message', { User_Message, username });
    };
  }
});