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

client.once('ready', () => {
    console.log(`UP AND AT THEM`);
})

client.on('message', message => {
    const { content, channel } = message;
    if (!content.startsWith(prefix) || message.author.bot) return;

    const args = content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    if (!command) return;

    if (command.args && !args.length) {
        return channel.send(`You didn't provide any arguments, ${message.author}`);
    }
    try {
        command.execute(message, args, games);
    } catch (error) {
        console.log(error);
        message.reply(`There was an error trying to execute that command, sorry!`)
    }
})

client.login(token);