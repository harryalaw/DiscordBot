const Game = require('../bot_components/Game.js')

module.exports = {
    'name': 'endgame',
    'aliases': ['end', 'reset'],
    execute(message, args, games) {
        const { channel, member } = message;
        // check permission of user
        if (!games.has(channel.id) || !member.hasPermission("ADMINISTRATOR")) return
        const game = games.get(channel.id)
        game.players.forEach((value, member) => {
            member.roles.set([]);
        })
        games.delete(channel.id);
        console.log(games);
    }
}