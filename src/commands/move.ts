import { prefix } from '../../config.json';
import { Command } from '../utility/command';

const move: Command = {
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

        const game = games.get(channel.id)!;
        let degree = parseInt(args[0]);
        if (isNaN(degree)) {
            return message.reply(`Type your messages like \`${prefix}move 10\` or \`${prefix}move -5\``);
        }

        game.board.moveDial(degree);
        game.board.sendAsMessage(true, channel);
    }
}

export { move as default };