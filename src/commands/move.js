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
    cooldown: 2,
    execute(message, args, games) {
        const { channel } = message;

        const game = games.get(channel.id);

        if (isNaN(args[0])) {
            return message.reply(`Type your messages like \`${prefix}move 10\` or \`${prefix}move -5\``);
        }

        game.board.moveDial(args[0]);
        game.board.sendAsMessage(true, channel);
    }
}