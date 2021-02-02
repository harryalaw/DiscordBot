import { Util } from '../utility/util';
import { Command } from '../utility/command';

let changeteam: Command = {
    name: 'changeteam',
    description: 'Change which team you are on or randomise all the teams.',
    usage: ['', '[team number]', 'shuffle'],
    argExplanation: `If no team is specified you will join the smaller team. Otherwise you join the team you chose. If the shuffle mode is used then both teams are randomised.`,
    needsGame: true,
    needsPlayer: true,
    cooldown: 5,
    execute(message, args, games) {
        const { channel, member } = message;
        const game = games.get(channel.id)!;

        // Null member if they are no longer a valid member of the server after sending
        if (member == null) return;

        if (args[0] == 'shuffle') {
            game.shuffleTeams();
            return channel.send(`I've randomised the teams!`);
        }
        else if (args[0] !== '1' && args[0] !== '2') {
            const team = game.teams[0].has(member!.id) ? 1 : 0;
            game.setTeam(member, team);
            return channel.send(`${Util.getName(member)} is now on Team ${game.players.get(member)! + 1}`);
        }
        else {
            game.setTeam(member, parseInt(args[0]));
            return channel.send(`${Util.getName(member)} is now on Team ${game.players.get(member)! + 1}`);
        }
    }
}
export { changeteam as default };