import { Command } from "../utility/command";

const reload: Command = {
    name: 'reload',
    description: 'Reloads a command, used for debugging purposes.',
    aliases: ['r'],
    needsChannel: false,
    needsGame: false,
    needsRound: false,
    needsPlayer: false,
    needsActiveTeam: false,
    execute(message, args, games, commands) {
        if (!args.length) return message.channel.send(`You didn't pass any command to reload, ${message.author}!`);
        const commandName = args[0].toLowerCase();
        const command = commands.get(commandName)
            || commands.find(cmd => cmd.aliases !== undefined && cmd.aliases.includes(commandName));
        if (!command) return message.channel.send(`There is no command with name or alias \`${commandName}\`, ${message.author}!`);

        delete require.cache[require.resolve(`./${command.name}.js`)];
        try {
            const newCommand = require(`./${command.name}.js`);
            commands.set(newCommand.name, newCommand);
            message.channel.send(`Command \`${command.name}\` was reloaded!`);
        } catch (error) {
            console.error(error);
            message.channel.send(`There was an error while reloading a command \`${command.name}\`:\n\`${error.message}\``);
        }
    }
}

export { reload as default };