/* eslint-disable no-unused-vars */
/* eslint-disable prefer-const */
const { prefix } = require('../config.json');

const validatePermissons = (permissions) => {
	const validPermissions = [
		'CREATE_INSTANT_INVITE',
		'KICK_MEMBERS',
		'BAN_MEMBERS',
		'ADMINISTRATOR',
		'MANAGE_CHANNELS',
		'MANAGE_GUILD',
		'ADD_REACTIONS',
		'VIEW_AUDIT_LOG',
		'PRIORITY_SPEAKER',
		'STREAM',
		'VIEW_CHANNEL',
		'SEND_MESSAGES',
		'SEND_TTS_MESSAGES',
		'MANAGE_MESSAGES',
		'EMBED_LINKS',
		'ATTACH_FILES',
		'READ_MESSAGE_HISTORY',
		'MENTION_EVERYONE',
		'USE_EXTERNAL_EMOJIS',
		'VIEW_GUILD_INSIGHTS',
		'CONNECT',
		'SPEAK',
		'MUTE_MEMBERS',
		'DEAFEN_MEMBERS',
		'MOVE_MEMBERS',
		'USE_VAD',
		'CHANGE_NICKNAME',
		'MANAGE_NICKNAMES',
		'MANAGE_ROLES',
		'MANAGE_WEBHOOKS',
		'MANAGE_EMOJIS',
	];
	for (const permission of permissions) {
		if (!validPermissions.includes(permission)) {
			throw new Error(`Unkown permission node "${permission}"`);
		}
	}
};

module.exports = (client, commandOptions) => {
	let {
		commands,
		expectedArgs = '',
		permissionError = 'Computer says no.',
		minArgs = 0,
		maxArgs = null,
		permissions = [],
		requiredRoles = [],
		// eslint-disable-next-line comma-dangle
		callback
	} = commandOptions;

	// Ensure commands and alisases are arrays
	if (typeof commands === 'string') {
		commands = [commands];
	}

	console.log(`Registering command "${commands[0]}`);

	// ensure the permisions are in a aarray and are all valid.
	if (permissions.length) {
		if (typeof permissions === 'string') {
			permissions = [permissions];
		}

		validatePermissons(permissions);
	}

	// Listen for messages
	client.on('message', message => {
		const { member, content, guild } = message;

		for(const alias of commands) {
			// eslint-disable-next-line curly
			if (content.toLowercase().startsWith(`${prefix}${alias.toLowercase()}`))
			// A command has been ran.
			// This allows people to put capital letter anywhere within the alias and it's not going to break anything.

			// Ensure the user has the required permissions.
				for (const permission of permissions) {
					if (!member.hasPermission(permission)) {
						message.reply(permissionError);
						return;
					}
				}

			// ensure the user has the required roles.
			for(const requiredRole of requiredRoles) {
				// eslint-disable-next-line no-shadow
				const role = guild.roles.cache.find(role => role.name === requiredRole);

				if (!role || !member.roles.cache.has(role.id)) {
					message.reply(`You must have the "${requiredRole}" role to use this command.`);
					return;
				}
			}

			// Split on any number of spaces.
			// eslint-disable-next-line no-shadow-restricted-names
			const arguments = content.split(/[ ]+/);

			// remove the command which is the first index
			arguments.shift();

			// Ensure we have the correct number of arguments.
			if (arguments.length < minArgs || (
				maxArgs !== null && arguments.length > maxArgs
			)) {
				message.reply(`Incorrect syntax! Use ${prefix}${alias} ${expectedArgs}`);
				return;
			}

			// Handle the custom command code.
			callback(message, arguments, arguments.join(' '));

			return;
		}
	});
};