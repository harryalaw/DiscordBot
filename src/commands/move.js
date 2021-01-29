const { prefix } = require('../../config.json');

module.exports = {
    name: 'move',
    description: 'Move the dial by the specified number of degrees.',
    aliases: ['nudge'],
    usage: ['[degrees]'],
    argExplanation: 'Use a positive value for degrees to move the dial clockwise, and a negative value to move the dial counterclockwise.',
    needsGame: true,
    needsPlayer: true,
    needsRound: true,
    needsActiveTeam: true,
    cooldown: 5,
    execute(message, args, games) {
        const { channel, member } = message;

        const game = games.get(channel.id);
        // if (!game.teams[game.turn].has(member.id)) {
        //     return message.channel.send(`Only the players on Team ${game.turn + 1} can move the dial`);
        // }

        if (isNaN(args[0])) {
            return message.reply(`Type your messages like \`${prefix}move 10\` or \`${prefix}move -5\``);
        }

        game.board.moveDial(args[0]);
        game.board.sendAsMessage(true, channel);
    }
}