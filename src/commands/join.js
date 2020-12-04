const Util = require('../utility/Util.js')

module.exports = {
    'name': 'join',
    'description': "Join a game of wavelength",
    execute(message, args, games) {
        const { channel, member } = message;
        if (!games.has(message.channel.id)) return message.reply(`There's no game in this channel!`);

        let game = games.get(channel.id);
        if (game.started) return channel.send("Please wait for the game to finish to join in!");

        game.addPlayer(member, args[0]);
        message.channel.send(`Added ${Util.getName(member)}`);
    }
}