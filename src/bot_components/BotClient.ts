import { Client, Collection, DMChannel, GuildMember, NewsChannel, TextChannel } from "discord.js";
import { readdirSync } from "fs";
import { Game } from "./Game";
import { Command } from '../utility/command';

import { prefix, token } from '../../config.json';

export class BotClient {
    client: Client;
    commands: Collection<string, Command>;
    games: Collection<string, Game>;
    cooldowns: Collection<string, Collection<string, number>>;

    constructor() {
        this.client = new Client();

        this.commands = new Collection();
        this.initCommands();
        this.games = new Collection();
        this.cooldowns = new Collection();
    }

    async initCommands() {
        const commandFiles = readdirSync('./dist/src/commands');
        console.log(commandFiles);
        // Doesn't work at the moment, can't import the module
        for (const file of commandFiles) {
            const command: Command = await import(`./dist/src/commands/${file}`);
            this.commands.set(command.name, command);
        }
    }

    validateCommand(command: Command, channel: TextChannel | DMChannel | NewsChannel, member: GuildMember): string {

        if (command.needsGame && !this.games.has(channel.id)) {
            return `There's no game in this channel!`;
        }

        // game is now always valid since the command.needsX
        // contain the needsGame condition;
        const game = this.games.get(channel.id)!;

        if (command.needsPlayer && game.players.get(member) == undefined) {
            return `You need to \`${prefix}join\` the game to play.`;
        }
        else if (command.needsRound && !game.started) {
            return `The round is over, start a new one with \`${prefix}start\``;
        }
        else if (command.needsActiveTeam && game.turn !== game.players.get(member)) {
            return `It's not your team's turn to play`;
        }
        else {
            return '';
        }
    }


    start() {
        this.client.once('ready', () => {
            console.log("Bot is online");
        })
        this.client.on('message', message => {
            console.log(this.commands);
            const { content, channel, member } = message;
            if (member == null) return;
            if (!content.startsWith(prefix) || message.author.bot) return;

            const args = content.slice(prefix.length).trim().split(/ +/);
            const commandName = args.shift()!.toLowerCase();

            const command = this.commands.get(commandName);
            if (!command) return;

            const invalidCommandMessage = this.validateCommand(command, channel, member);
            if (invalidCommandMessage !== '') {
                return message.reply(invalidCommandMessage);
            }

            // Cooldown for commands
            if (!this.cooldowns.has(command.name)) {
                this.cooldowns.set(command.name, new Collection());
            }

            const now = Date.now();
            const timestamps = this.cooldowns.get(command.name)!;
            const cooldownAmount = command.cooldown || 3;
            if (timestamps.has(message.author.id)) {
                const earliestNextUse = timestamps.get(message.author.id)! + cooldownAmount;

                if (now < earliestNextUse) {
                    const timeLeft = (earliestNextUse - now) / 1000;
                    return message.author.send(`Please wait ${timeLeft.toFixed(1)} more second(s) before reusing \`${command.name}\` command`)
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
                command.execute(message, args, this.games, this.commands);
            } catch (error) {
                console.log(error);
                message.reply(`There was an error trying to execute that command, sorry!`);
            }
        })

        this.client.login(token);
    }
}