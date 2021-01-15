const Game = require('../bot_components/Game.js');
const { prefix } = require('../../config.json')

module.exports = {
    'name': 'creategame',
    'description': 'Create a new game of wavelength and change the settings',
    'aliases': ['create', 'c'],
    execute(message, args, games) {
        const { channel } = message;
        if (games.has(channel.id)) return message.channel.send("There's already a game in this channel!");
        let game = new Game(message.channel);
        games.set(channel.id, game);
        channel.send(`Who wants to play Wavelength? \`${prefix}join\` in!`);
        return
    }
}