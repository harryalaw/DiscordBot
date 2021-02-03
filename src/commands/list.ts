import { MessageEmbed } from "discord.js";
import { Command } from "../utility/command";
import { Util } from "../utility/util";


const list: Command = {
    name: 'list',
    description: 'Lists current players in the game and which teams they are on.',
    aliases: ['teams', 'team'],
    needsChannel: true,
    needsGame: true,
    needsRound: false,
    needsPlayer: false,
    needsActiveTeam: false,
    cooldown: 10,
    execute(message, args, games) {
        const { channel } = message;
        const game = games.get(channel.id)!;
        // Currently the next line does nothing since the creator is always in the game.
        if (game.players.size === 0) return message.channel.send(`No one is in the lobby at the moment!`)

        const team1: Array<string> = [];
        const team2: Array<string> = [];
        game.players.forEach((value, member) => {
            const name = Util.getName(member);
            if (game.players.get(member) === 0) team1.push(name);
            if (game.players.get(member) === 1) team2.push(name);
        })

        // Embed fields may not be empty so use a zero-width space instead (\u200b)
        const team1FieldVal = team1.length === 0 ? '\u200b' : team1.join('\n');
        const team2FieldVal = team2.length === 0 ? '\u200b' : team2.join('\n');

        const teamEmbed = new MessageEmbed()
            .setColor(game.board.colors[0])
            .addFields(
                { name: 'Team 1', value: team1FieldVal, inline: true },
                { name: 'Team 2', value: team2FieldVal, inline: true },
            ).setFooter(`It's currently Team ${game.turn + 1}'s turn`);

        channel.send(teamEmbed);
    }
}

export { list as default };