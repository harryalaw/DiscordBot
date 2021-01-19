const Util = require('../utility/Util.js')

module.exports = {
    'name': 'join',
    'description': "Join a game of wavelength.",
    'usage': ['', '[team number]'],
    'argExplanation': `You can specify the team you want to join by including the number, otherwise I'll put you in the smaller team`,
    execute(message, args, games) {
        const { channel, member } = message;
        if (!games.has(message.channel.id)) return message.reply(`There's no game in this channel!`);

        let game = games.get(channel.id);
        if (game.started) return channel.send("Please wait for the round to finish to join in!");

        game.addPlayer(member, args[0]);
        message.channel.send(`Added ${Util.getName(member)} to Team ${game.players.get(member) + 1}`);
    }
}