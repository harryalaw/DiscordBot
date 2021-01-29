const { prefix } = require('../../config.json');
const Util = require('./../utility/Util');

module.exports = {
    name: 'lock',
    description: "Let's anyone on the active team lock in their answer and trigger the end of the round.",
    aliases: ["lockin", "confirm"],
    needsGame: true,
    needsPlayer: true,
    needsRound: true,
    needsActiveTeam: true,
    cooldown: 5,
    execute(message, args, games) {
        const { channel } = message;

        const game = games.get(channel.id);
        game.started = false

        let scoredPoints;

        const delta = Math.abs(game.board.fanAngle - game.board.dialAngle);
        if (delta <= 3.5) scoredPoints = 4;
        else if (delta <= 10.5) scoredPoints = 3;
        else if (delta <= 17.5) scoredPoints = 2;
        else scoredPoints = 0;

        const reactions = [];
        channel.send(`The other team now gets to guess if they think the target is to the left or the right of the dial. If they guess the direction correctly they will get 1 point!\nDiscuss and once you've decided someone should react with ⬅️ or ➡️ to let me know`)
            .then(msg => {
                reactions.push(msg.react("⬅️"));
                reactions.push(msg.react("➡️"));
                Promise.all(reactions).then(() => msg.awaitReactions(
                    Util.reactionFilterOneTeam(["⬅️", "➡️"], game, false), { max: 1 })
                    .then(collected => {
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
                            channel.send(`Team ${game.turn + 1} scored ${scoredPoints}, Team ${(game.turn ^ 1) + 1} scored ${otherPoints}`);
                            channel.send(game.displayScore());
                            // If the current team gets a perfect guess and are still trailing they get to go again.
                            const nextTeam = scoredPoints === 4 && game.scores[game.turn] < game.scores[game.turn ^ 1] ? game.turn : game.turn ^ 1;
                            if (nextTeam == game.turn) {
                                channel.send(`Because Team ${nextTeam + 1} got a perfect guess and are still losing it's their turn again. Please select your psychic and have them use \`${prefix}send\` to take their turn!`);
                            } else {
                                channel.send(`It's Team ${nextTeam + 1}'s go next, pick your psychic and have them \`${prefix}send\` to get the next round started.`);
                            }
                            // Updates the game turn to the next team
                            game.turn = nextTeam;
                        });
                    }))
            })
    }
}