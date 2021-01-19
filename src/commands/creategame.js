const Game = require('../bot_components/Game.js');
const { prefix } = require('../../config.json')

module.exports = {
    'name': 'creategame',
    'description': 'Create a new game of wavelength in this channel.',
    'aliases': ['create', 'c'],
    execute(message, args, games) {
        const { channel } = message;
        if (channel.type === 'dm') return message.channel.send("Sorry but we can't just play with two of us!");
        if (games.has(channel.id)) return message.channel.send("There's already a game in this channel!");
        let game = new Game(message.channel, message.member);
        games.set(channel.id, game);
        channel.send(`Who wants to play Wavelength? \`${prefix}join\` in!`);
        return
    }
}