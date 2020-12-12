const Discord = require('discord.js');
const { token, prefix } = require('./config.json');
const client = new Discord.Client();

client.on('ready', () => {
	console.log('Logged in as Grog!');
});

client.login(token);