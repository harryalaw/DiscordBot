const Util = require('../utility/Util.js');

module.exports = {
    name: 'list',
    description: 'Lists current players in the game and which teams they are on',
    execute(message, args, games) {
        const { channel } = message;
        if (!games.has(channel.id)) return;
        const game = games.get(channel.id);

        if (game.players.size === 0) return message.channel.send(`No one is in the lobby at the moment!`)
        const names = []
        const team1 = [];
        const team2 = [];
        game.players.forEach((value, member) => {
            const name = Util.getName(member);
            names.push(name);
            if (game.players.get(member) == 0) team1.push(name);
            if (game.players.get(member) == 1) team2.push(name);
        })

        message.channel.send(`Players in the game: ${names.join(', ')}`);
        message.channel.send(`Team 1 is: ${team1.join(', ')}`);
        message.channel.send(`Team 2 is: ${team2.join(', ')}`);
    }
}