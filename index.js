/* eslint-disable no-unused-vars */
const Discord = require('discord.js');
const path = require('path');
const fs = require('fs');
const client = new Discord.Client();

client.on('ready', () => {
	console.log('Logged in as Grog!');

	const baseFile = 'command-base.js';
	const commandBase = require(`./Commands/${baseFile}`);

	const readCommands = dir => {
		const files = fs.readdirSync(path.join(__dirname, dir));
		for (const file of files) {
			const stat = fs.lstatSync(path.join(__dirname, dir, file));
			if (stat.isDirectory()) {
				readCommands(path.join(dir, file));
			// eslint-disable-next-line brace-style
			} else if (file !== baseFile) {
				const option = require(path.join(__dirname, dir, file));
				commandBase(client, option);
			}
		}
	};

	readCommands('Commands');
});

client.login(process.env.Token);