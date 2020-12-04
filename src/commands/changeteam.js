module.exports = {
    'name': 'changeteam',
    'description': 'Change to the other team',
    execute(message, args, games) {
        const { channel, member } = message;
        if (!games.has(channel.id)) return channel.send("There's no game in this channel!");
        const game = games.get(channel.id);
        if (args[0] == 'shuffle') {
            game.shuffleTeams();
        }
        else if (args[0] != 1, 2) {
            const team = game.teams[0].has(member.id) ? 1 : 0;
            game.setTeam(member, team);
        }
        else {
            game.setTeam(member, args[0]);
        }
    }
}