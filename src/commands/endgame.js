const Game = require('../bot_components/Game.js');
const { BOT_OWNER } = require('../../config.json');

module.exports = {
    'name': 'endgame',
    'aliases': ['end', 'reset'],
    'description': 'Ends the game of wavelength in this channel',
    execute(message, args, games) {
        const { channel, member } = message;
        // check permission of user
        if (!games.has(channel.id) || (this.owner !== member && !member.id != BOT_OWNER)) {
            return channel.send(`Only the person who created the game can end it.`)
        }
        games.delete(channel.id);
    }
}