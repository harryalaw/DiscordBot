const Game = require('../bot_components/Game.js');
const { BOT_OWNER } = require('../../config.json');
const { ReactionUserManager } = require('discord.js');
const Util = require('./../utility/Util');

module.exports = {
    name: 'endgame',
    description: 'Ends the game of wavelength in this channel.',
    needsGame: true,
    execute(message, args, games) {
        const { channel, member } = message;
        const game = games.get(channel.id);
        // Only the game owner or the bot owner can end it
        if (game.owner !== member && member.id !== BOT_OWNER) {
            return channel.send(`Only the game owner, ${game.owner} can end the game.`)
        }
        const reactions = [];
        channel.send(`Please confirm that you want to end the game`)
            .then((msg) => {
                reactions.push(msg.react("✅"));
                reactions.push(msg.react("❌"));
                Promise.all(reactions).then(() => {
                    msg.awaitReactions(Util.reactionFilter(["✅", "❌"]), { max: 1 })
                        .then(collected => {
                            if (collected.has("✅")) {
                                games.delete(channel.id);
                                return channel.send(`The game in this channel has ended.`);
                            }
                            else {
                                return channel.send(`The game has not been ended`);
                            }
                        })
                })
            })
    }
}