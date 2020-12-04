module.exports = {
    'name': 'move',
    'description': 'Move the dial by some degrees, use \`+<Deg>\` to move right, \`-<Deg>\` to move left',
    'aliases': ['nudge'],
    execute(message, args, games) {
        const { channel, member } = message;
        if (!games.has(channel.id)) return
        const game = games.get(channel.id);
        if (!game.teams[game.turn].has(member.id)) return;
        if (isNaN(args[0])) return message.reply(`Type your messages as \`?move 10\` or \`?move -5\``);

        game.board.moveDial(args[0]);
        game.board.sendAsMessage(true, channel);
        // game.board.sendAsMessage(false, channel);
    }
}