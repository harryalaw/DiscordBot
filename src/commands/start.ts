//  Discord = require('discord.js');
// const Util = require('../utility/Util.js');
import { Util } from '../utility/util';
import { prompts } from '../../assets/text_assets/prompts.json';
import { prefix } from '../../config.json';
import { Command } from '../utility/command';
import { MessageReaction } from 'discord.js';

const start: Command = {
    name: 'start',
    aliases: ['send'],
    description: `Starts the next round of wavelength, I'll send a DM to whoever uses it explaining what to do next.`,
    needsGame: true,
    needsPlayer: true,
    needsActiveTeam: true,
    cooldown: 5,
    execute(message, args, games) {
        const { channel, author, member } = message;
        const game = games.get(channel.id)!;
        if (game.started) return;

        const choices = Util.sample(prompts, 3)
        game.clueGiver = author.id;
        game.started = true;
        game.resetPrompt();
        game.board.setFanAngle();

        game.board.dialAngle = 0;
        game.board.setNewColors();

        const preamble = `I'll be sending you a choice of a few spectrums to choose between, but first I'll show you where the target will be.`
        const text = `Here are the spectrums you get to choose between:
        \n:one: ${choices[0][0]} - ${choices[0][1]}\n:two: ${choices[1][0]} - ${choices[1][1]}\n:three: ${choices[2][0]} - ${choices[2][1]}
        \nLook at where the target’s center is located spatially along the visible area of the wheel. Now think of a clue that is conceptually where the target is located ON THE SPECTRUM between the two concepts on your card.
        \nThink of a clue that matches one of the possible spectrums above and once you've decided pick the spectrum by reacting with the corresponding emoji and give your clue to your team!`;


        message.channel.send(`I'm sending ${Util.getName(member!)} the instructions to start the next round.`)

        const reactions: Array<Promise<MessageReaction>> = [];
        author.send(preamble).then((msg) => {
            game.board.bufferImage(false).then(img => author.send(img)).then(() => {
                author.send(text).then((msg) => {
                    reactions.push(msg.react("1️⃣"));
                    reactions.push(msg.react("2️⃣"));
                    reactions.push(msg.react("3️⃣"));
                    Promise.all(reactions).then(() => {
                        msg.awaitReactions(Util.reactionFilter(["1️⃣", "2️⃣", "3️⃣"]), { max: 1 })
                            .then(collected => {
                                let prompt = collected.has("1️⃣") ?
                                    choices[0] : collected.has("2️⃣") ?
                                        choices[1] : choices[2];
                                game.board.setPrompt(prompt);
                                game.board.sendAsMessage(true, channel);
                            });
                    }).catch(console.error);
                }).catch(console.error);
            }).catch(console.error);
        }).catch(error => {
            console.error(`Could not send start DM to ${message.author.tag}.\n`);
            message.reply('It seems like I can\'t DM you! Do you have DMs disabled? You can enable them for this server by changing your privacy settings in the top left.');
            game.started = false;
        });
    }
}

export { start as default };