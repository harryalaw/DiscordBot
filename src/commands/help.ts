import { Command } from "../utility/command";
import { prefix } from "../../config.json";
import { MessageEmbed } from "discord.js";

const help: Command = {
    name: 'help',
    description: 'List all of my commands or get info about a specific command.',
    aliases: ['commands'],
    usage: ['', '[command name]'],
    cooldown: 1,
    execute(message, args, games, commands) {
        const helperEmbed = new MessageEmbed();
        helperEmbed.setColor("#C8A2C8");
        helperEmbed.setFooter(`To find out about how to use a command you can use ${prefix}help [command]`);
        const data = [];
        if (!args.length) {
            helperEmbed.addField("List of my commands", commands.map(command => command.name).join('\n'), false)

            return message.author.send(helperEmbed)
                .then(() => {
                    if (message.channel.type === 'dm') return;
                    message.reply(`I've sent you a DM with all my commands!`);
                })
                .catch(error => {
                    console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
                    message.reply(`I couldn't DM you! Do you have DMs disabled?`);
                });
        }
        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases !== undefined && c.aliases.includes(name));

        if (!command) {
            return message.reply(`That's not a valid command!`);
        }
        helperEmbed.addField("Name", command.name, true);
        if (command.aliases) {
            helperEmbed.addField("Aliases", command.aliases.join(', '), true);
        }
        helperEmbed.addField("Cooldown", command.cooldown || 3, true);

        if (command.description) {
            helperEmbed.addField("Description", command.description, false);
        }

        if (command.usage) {
            helperEmbed.addField("Usage",
                command.usage.map(mode => `\`${prefix}${command.name} ${mode}\``).join('\n'), false);
        }
        if (command.argExplanation) {
            helperEmbed.addField("Usage Explained", command.argExplanation), false;
        }
        message.channel.send(helperEmbed);
    }
}

export { help as default };