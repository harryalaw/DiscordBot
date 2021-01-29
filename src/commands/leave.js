
module.exports = {
    name: 'leave',
    description: 'Lets you leave the pool of players in a game of wavelength',
    usage: [''],
    needsGame: true,
    needsPlayer: true,
    cooldown: 10,
    execute(message, args, games) {
        const { channel, member } = message;
        const game = games.get(channel.id);
        game.removePlayer(member);
    }
}