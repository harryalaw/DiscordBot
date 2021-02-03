import { Command } from "../utility/command";
import { Util } from "../utility/util";
import { prefix } from "../../config.json";

const join: Command = {
    name: 'join',
    description: "Join a game of wavelength.",
    usage: ['', '[team number]'],
    argExplanation: `You can specify the team you want to join by including the number, otherwise I'll put you in the smaller team`,
    needsChannel: true,
    needsGame: true,
    needsPlayer: false,
    needsRound: false,
    needsActiveTeam: false,
    cooldown: 5,
    execute(message, args, games) {
        const { channel, member } = message;
        let game = games.get(channel.id)!;
        if (game.players.has(member!)) return;
        // Check that a user has DMs allowed and send helpful message.
        message.author.send(`If you need any help with the rules of the game or how to use me type \`${prefix}help\` or \`${prefix}rules\`.`)
            .then(() => {
                game.addPlayer(member!, parseInt(args[0]));
                return channel.send(`Added ${Util.getName(member!)} to Team ${game.players.get(member!)! + 1}`);
            })
            .catch(error => {
                console.error(`Could not send join DM to ${message.author.tag}.`);
                return message.reply(`I couldn't send you a DM, please make sure they are enabled on this server by changing you privacy settings in the top left. Once you've done that type \`${prefix}join\` again!`)
            })

    }
}

export { join as default };