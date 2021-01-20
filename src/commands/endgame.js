const Game = require('../bot_components/Game.js');
const { BOT_OWNER } = require('../../config.json');

module.exports = {
    name: 'endgame',
    aliases: ['end', 'reset'],
    description: 'Ends the game of wavelength in this channel.',
    needsGame: true,
    execute(message, args, games) {
        const { channel, member } = message;
        const game = games.get(channel.id);
        // Only the creator of a game can end it or the bot owner
        if (game.owner !== member && member.id !== BOT_OWNER) {
            return channel.send(`Only the person who created the game can end it.`)
        }
        games.delete(channel.id);
        channel.send(`The game in this channel has ended.`);
        return
    }
}