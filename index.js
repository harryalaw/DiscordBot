const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token } = require('./config.json')

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));
const games = new Discord.Collection();

for (const file of commandFiles) {
    const command = require(`./src/commands/${file}`);
    client.commands.set(command.name, command);
}

const cooldowns = new Discord.Collection();

client.once('ready', () => {
    console.log(`UP AND AT THEM`);
})

client.on('message', message => {
    const { content, channel, member } = message;
    if (!content.startsWith(prefix) || message.author.bot) return;

    const args = content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    if (!command) return;
    if (command.needsGame && !games.has(channel.id)) {
        return message.reply(`There's no game in this channel!`);
    }
    const game = games.get(channel.id);

    if (command.needsPlayer && game.players.get(member) === undefined) {
        return message.reply(`You need to \`${prefix}join\` the game to play`);
    }
    if (command.needsRound && !game.started) {
        return message.reply(`The round is over, start a new one with \`${prefix}send\``)
    }
    if (command.needsActiveTeam && game.turn !== game.players.get(member)) {
        return message.reply(`It's not your team's turn to play`);
    }
    if (command.args && !args.length) {
        return channel.send(`You didn't provide any arguments, ${message.author}`);
    }

    // Cooldowns for commands
    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    }
    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    // cooldown for each command will default to 3 seconds if not defined
    const cooldownAmount = (command.cooldown || 3) * 1000;

    if (timestamps.has(message.author.id)) {
        const earliestNextUse = timestamps.get(message.author.id) + cooldownAmount;

        if (now < earliestNextUse) {
            const timeLeft = (earliestNextUse - now) / 1000;
            return message.author.send(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing \`${command.name}\` command))`)
                .catch(error => {
                    console.error(`Could not send DM to ${message.author.tag}.`);
                    message.reply(`It seems I can't DM you! Do you have DMs disabled?`);
                });
        }
    }
    timestamps.set(message.author.id, now);
    // Delete timestamps once the time has passed
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);


    try {
        command.execute(message, args, games);
    } catch (error) {
        console.log(error);
        message.reply(`There was an error trying to execute that command, sorry!`)
    }
})

client.login(token);