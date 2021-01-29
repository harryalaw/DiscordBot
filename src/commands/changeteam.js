const Util = require('../utility/Util.js');

module.exports = {
    name: 'changeteam',
    description: 'Change which team you are on or randomise all the teams.',
    usage: ['', '[team number]', 'shuffle'],
    argExplanation: `If no team is specified you will join the smaller team. Otherwise you join the team you chose. If the shuffle mode is used then both teams are randomised.`,
    needsGame: true,
    needsPlayer: true,
    cooldown: 5,
    execute(message, args, games) {
        const { channel, member } = message;
        const game = games.get(channel.id);

        if (args[0] == 'shuffle') {
            game.shuffleTeams();
            return channel.send(`I've randomised the teams!`);
        }
        else if (args[0] != 1, 2) {
            const team = game.teams[0].has(member.id) ? 1 : 0;
            game.setTeam(member, team);
            return channel.send(`${Util.getName(member)} is now on Team ${game.players.get(member) + 1}`);
        }
        else {
            game.setTeam(member, args[0]);
            return channel.send(`${Util.getName(member)} is now on Team ${game.players.get(member) + 1}`);
        }
    }
}