const Util = require('../utility/Util.js');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'list',
    description: 'Lists current players in the game and which teams they are on.',
    aliases: ['teams', 'team'],
    needsGame: true,
    cooldown: 10,
    execute(message, args, games) {
        const { channel } = message;
        const game = games.get(channel.id);
        // Currently the next line does nothing since the creator is always in the game.
        if (game.players.size === 0) return message.channel.send(`No one is in the lobby at the moment!`)

        const team1 = [];
        const team2 = [];
        game.players.forEach((value, member) => {
            const name = Util.getName(member);
            if (game.players.get(member) === 0) team1.push(name);
            if (game.players.get(member) === 1) team2.push(name);
        })

        // Embed fields may not be empty so use a zero-width space instead (\u200b)
        team1FieldVal = team1.length === 0 ? '\u200b' : team1.join('\n');
        team2FieldVal = team2.length === 0 ? '\u200b' : team2.join('\n');

        const teamEmbed = new MessageEmbed()
            .setColor(game.board.colors[0])
            .addFields(
                { name: 'Team 1', value: team1FieldVal, inline: true },
                { name: 'Team 2', value: team2FieldVal, inline: true },
            ).setFooter(`It's currently Team ${game.turn + 1}'s turn`);

        channel.send(teamEmbed);
    }
}