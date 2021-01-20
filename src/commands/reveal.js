const { prefix } = require('../../config.json');

module.exports = {
    name: 'reveal',
    description: "Let's the clue giver reveal the board and triggers the end of the round.",
    needsGame: true,
    execute(message, args, games) {
        const { channel, author, member } = message;

        const game = games.get(channel.id);
        if (!game.started) return channel.send(`The round is over, start a new one with !send`)
        if (game.clueGiver != author.id) return channel.send(`Only the cluegiver can reveal the answer!`);
        game.started = false

        let scoredPoints;

        const delta = Math.abs(game.board.fanAngle - game.board.dialAngle);
        if (delta <= 3.5) scoredPoints = 4;
        else if (delta <= 10.5) scoredPoints = 3;
        else if (delta <= 17.5) scoredPoints = 2;
        else scoredPoints = 0;

        const filter = (reaction, user, member) => {
            return ["⬅️", "➡️"].includes(reaction.emoji.name) && game.teams[game.turn ^ 1].has(user.id) && !user.bot;
        }

        const reactions = [];
        channel.send(`The other team now gets to guess if they think the target is to the left or the right of the dial.\nDiscuss and once you've decided someone should react with ⬅️ or ➡️ to let me know`)
            .then(msg => {
                reactions.push(msg.react("⬅️"));
                reactions.push(msg.react("➡️"));
                Promise.all(reactions).then(() => msg.awaitReactions(filter, { max: 1 }).then(collected => {
                    const result = collected.has("⬅️") ? "left" : "right";
                    game.board.bufferImage(false).then((img) => channel.send(img)).then(() => {
                        let otherPoints = 0;
                        if (scoredPoints != 4) {
                            // Having to do opposite since jimp.rotate doesn't align with how I think it rotates;
                            const fanLeftOfDial = game.board.fanAngle > game.board.dialAngle;
                            if ((fanLeftOfDial && result === "left") || !fanLeftOfDial && result === "right") {
                                otherPoints = 1;
                            }
                        }
                        game.scores[game.turn] += scoredPoints;
                        game.scores[game.turn ^ 1] += otherPoints;
                        channel.send(`Team ${game.turn + 1} scored ${scoredPoints}, Team ${(game.turn ^ 1) + 1} scored ${otherPoints}\nTeam 1 \t${game.scores[0]}-${game.scores[1]} \tTeam 2`);
                        // If the current team gets a perfect guess and are still trailing they get to go again.
                        const nextTeam = scoredPoints === 4 && game.scores[game.turn] < game.scores[game.turn ^ 1] ? game.turn : game.turn ^ 1;
                        if (nextTeam == game.turn) {
                            channel.send(`Because Team ${nextTeam + 1} got a perfect guess and are still losing it's their turn again. Please select your psychic and have them use \`${prefix}send\` to take their turn!`);
                        } else {
                            channel.send(`It's Team ${nextTeam + 1}'s go next, pick your psychic and have them \`${prefix}send\` to get the next round started.`);
                        }
                    });
                }))
            })
    }
}