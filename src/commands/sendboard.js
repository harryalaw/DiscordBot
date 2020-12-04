const Discord = require('discord.js');
const Util = require('../utility/Util.js');
const { prompts } = require('../../assets/prompts.json');

module.exports = {
    'name': 'sendboard',
    'aliases': ['s', 'send', 'start'],
    execute(message, args, games) {
        const { channel, author, member } = message;
        if (!games.has(channel.id)) return;

        const game = games.get(channel.id);
        const choices = Util.sample(prompts, 2)
        game.clueGiver = author.id;
        game.turn = game.players.get(member);
        game.board.dialAngle = 0;

        const text = `Here are the two spectrums you can choose between:
        \n:one: ${choices[0][0]} - ${choices[0][1]}\n:two: ${choices[1][0]} - ${choices[1][1]}
        \nChoose by reacting to this message with the corresponding emoji!`

        const promptFilter = (reaction, user) => {
            console.log(reaction.emoji.name);
            return reaction.emoji.name == "1️⃣" || reaction.emoji.name == "2️⃣";
        }

        const thumbsUpFilter = (reaction, user) => {
            console.log(reaction.emoji.name);
            return reaction.emoji.name == "👍" && !user.bot;
        }


        const reactions = [];
        author.send(text).then((msg) => {
            reactions.push(msg.react("1️⃣"));
            reactions.push(msg.react("2️⃣"));
            Promise.all(reactions).then(() => {
                msg.awaitReactions(promptFilter, { max: 1 }).then(collected => {
                    let prompt = collected.has("1️⃣") ? choices[0] : choices[1];
                    game.board.prompt = prompt;
                    game.board.setFanAngle();
                    game.board.bufferImage(false).then(img => author.send(img)).then(() =>
                        author.send(`Look at where the target is and try to think of something that lies on the spectrum there! Once you've done that give your team the clue and give me a thumbs up!`))
                        .then((msg) => msg.react("👍").then(() => msg.awaitReactions(thumbsUpFilter, { max: 1 })
                            .then(() => {
                                game.board.sendAsMessage(true, channel);
                            })));
                });
            }).catch(console.error);
        }).catch(console.error);
        // game.newPrompt();
        // game.board.setFanAngle();
        // game.board.bufferImage(false).then(img => author.send(img));
    }
}