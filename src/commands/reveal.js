module.exports = {
    'name': 'reveal',
    'description': "Let's the clue setter reveal the board",
    execute(message, args, games) {
        const { channel, author, member } = message;
        if (!games.has(channel.id)) return;
        const game = games.get(channel.id);
        if (game.clueGiver != author.id) return channel.send(`Only the cluegiver can reveal the answer!`);

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
                        channel.send(`Guessing team scored ${scoredPoints}, other team score ${otherPoints}\nTeam 1 ${game.scores[0]}-${game.scores[1]} Team 2`);
                    });
                }))
            })
    }
}