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
})
