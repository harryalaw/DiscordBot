import { Command } from "../utility/command";

const leave: Command = {
    name: 'leave',
    description: 'Lets you leave the pool of players in a game of wavelength',
    usage: [''],
    needsChannel: true,
    needsGame: true,
    needsPlayer: true,
    needsRound: false,
    needsActiveTeam: false,
    cooldown: 10,
    execute(message, args, games) {
        const { channel, member } = message;
        const game = games.get(channel.id)!;
        game.removePlayer(member!);
    }
}
export { leave as default }