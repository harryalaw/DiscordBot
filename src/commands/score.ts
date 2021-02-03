import { MessageReaction } from 'discord.js';
import { Command } from '../utility/command';
import { Util } from './../utility/util';

const score: Command = {
    name: 'score',
    aliases: ['scores'],
    description: `Lists the scores of the two teams. If the \`set\` option is included then can be used to set the scores`,
    usage: ['', 'set [team1 score] [team2 score]'],
    argExplanation: `Including the optional \`set\` lets you specify the score you want to set it to`,

    needsChannel: true,
    needsGame: true,
    needsRound: false,
    needsPlayer: false,
    needsActiveTeam: false,

    cooldown: 5,
    execute(message, args, games) {
        const { channel } = message;
        const game = games.get(channel.id)!;

        if (args[0] === 'set') {
            if (args.length !== 3) {
                return message.reply(`You need to provide a score for both teams.`);
            }
            if (Util.invalidScores(parseInt(args[1]), parseInt(args[2]), game.scoreCap)) {
                return message.reply(`The scores you provide need to be whole numbers less than ${game.scoreCap}`);
            }


            const reactions: Array<Promise<MessageReaction>> = [];
            // Get confirmation from other team
            message.channel.send(`Do both teams agree on the score being set to ${args[1]}-${args[2]}?`)
                .then((msg) => {
                    reactions.push(msg.react("✅"));
                    reactions.push(msg.react("❌"));
                    Promise.all(reactions).then(() => {
                        msg.awaitReactions(Util.reactionFilterOneTeam(["✅", "❌"], game, false), { max: 1 })
                            .then(collected => {
                                if (collected.has("✅")) {
                                    game.scores[0] = parseInt(args[1]);
                                    game.scores[1] = parseInt(args[2]);
                                    return channel.send(game.displayScore());
                                }
                                else return channel.send(`The other team didn't agree to changing the score`);
                            })
                    })
                });
        }
        else {
            return channel.send(game.displayScore());
        }
    }
}

export { score as default };