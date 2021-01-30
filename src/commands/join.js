const Util = require('../utility/Util.js');
const { prefix } = require('./../../config.json');

module.exports = {
    name: 'join',
    description: "Join a game of wavelength.",
    usage: ['', '[team number]'],
    argExplanation: `You can specify the team you want to join by including the number, otherwise I'll put you in the smaller team`,
    needsGame: true,
    cooldown: 5,
    execute(message, args, games) {
        const { channel, member } = message;
        let game = games.get(channel.id);
        if (game.players.has(member)) return;
        // Check that a user has DMs allowed and send helpful message.
        message.author.send(`If you need any help with the rules of the game or how to use me type \`${prefix}help\` or \`${prefix}rules\`.`)
            .then(() => {
                game.addPlayer(member, args[0]);
                return channel.send(`Added ${Util.getName(member)} to Team ${game.players.get(member) + 1}`);
            })
            .catch(error => {
                console.error(`Could not send join DM to ${message.author.tag}.`);
                return message.reply(`I couldn't send you a DM, please make sure they are enabled on this server by changing you privacy settings in the top left. Once you've done that type \`${prefix}join\` again!`)
            })

    }
}