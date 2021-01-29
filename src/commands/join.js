const Util = require('../utility/Util.js')

module.exports = {
    name: 'join',
    description: "Join a game of wavelength.",
    usage: ['', '[team number]'],
    argExplanation: `You can specify the team you want to join by including the number, otherwise I'll put you in the smaller team`,
    needsGame: true,
    cooldown: 5,
    execute(message, args, games) {
        const { channel, member } = message;
        let game = games.get(channel.id);
        if (game.players.has(member)) return;
        game.addPlayer(member, args[0]);
        channel.send(`Added ${Util.getName(member)} to Team ${game.players.get(member) + 1}`);
    }
}