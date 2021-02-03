import { Game } from '../bot_components/Game';
import { Command } from '../utility/command';

const { prefix } = require('../../config.json')

const createGame: Command = {
    name: 'creategame',
    description: 'Create a new game of wavelength in this channel.',
    aliases: ['create', 'c'],
    cooldown: 30,
    needsChannel: true,
    needsGame: false,
    needsPlayer: false,
    needsRound: false,
    needsActiveTeam: false,
    execute(message, args, games, commands) {
        const { channel, member } = message;
        if (member === null) return;
        if (channel.type === 'dm') return message.channel.send("Sorry but we can't just play with two of us!");
        if (games.has(channel.id)) return message.channel.send("There's already a game in this channel!");

        let game = new Game(message.channel, member);
        games.set(channel.id, game);
        channel.send(`Who wants to play Wavelength? \`${prefix}join\` in!`);
        // Also calls the join command upon creating a game
        commands.get('join')!.execute(message, [''], games, commands);
        return
    }
}

export { createGame as default };