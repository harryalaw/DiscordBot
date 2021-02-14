import { addReactionsToMessage, Util } from '../utility/util';
import { prompts } from '../../assets/text_assets/prompts.json';
import { Command } from '../utility/command';
import { MessageEmbed } from 'discord.js';

const start: Command = {
    name: 'start',
    aliases: ['send'],
    description: `Starts the next round of wavelength, I'll send a DM to whoever uses it explaining what to do next.`,
    needsChannel: true,
    needsGame: true,
    needsRound: false,
    needsPlayer: true,
    needsActiveTeam: true,
    cooldown: 5,
    execute: async (message, args, games) => {
        const { channel, author, member } = message;
        const game = games.get(channel.id)!;
        if (game.started) return;

        const choices = Util.sample(prompts, 3)
        game.clueGiver = author.id;
        game.started = true;
        game.resetBoard();
        console.log(game.board.fanAngle);

        const promptEmbed = new MessageEmbed()
        message.channel.send(`I'm sending ${Util.getName(member!)} the instructions to start the next round.`)
        try {
            promptEmbed.addField(`Spectrum Choices`, `\n:one: ${choices[0][0]} - ${choices[0][1]}\n:two: ${choices[1][0]} - ${choices[1][1]}\n:three: ${choices[2][0]} - ${choices[2][1]}`);
            const img = await game.board.bufferImage(false);
            promptEmbed.setImage('attachment://board.png');
            promptEmbed.addField('Your task', 'You now have to try to get your team to move the dial to where it is in the picture shown below. You\'ll need to try to think of a thing or a concept that you would place at that point between the two extremes on the spectrum of your choice.')
            promptEmbed.addField('\u200b', 'Once you\'ve decided which spectrum you want to use for the round, react with the corresponding emoji and give your clue to your team!');
            const msg = await author.send({ files: [img], embed: promptEmbed });
            await addReactionsToMessage(["1️⃣", "2️⃣", "3️⃣"], msg);
            const collected = await msg.awaitReactions(Util.reactionFilter(["1️⃣", "2️⃣", "3️⃣"]), { max: 1 });

            let prompt = collected.has("1️⃣") ?
                choices[0] : collected.has("2️⃣") ?
                    choices[1] : choices[2];
            game.board.setPrompt(prompt);
            game.board.dialAngle = 0;
            game.board.sendAsMessage(true, channel);
        }
        catch {
            console.error(`Could not send start DM to ${message.author.tag}.\n`);
            message.reply('It seems like I can\'t DM you! Do you have DMs disabled? You can enable them for this server by changing your privacy settings in the top left.');
            game.started = false;
        }
    }
}

export { start as default };