import { Collection, Message } from "discord.js";
import { Game } from "../bot_components/Game";
interface Command {
    name: string;
    description: string;

    cooldown?: number;
    aliases?: Array<string>;
    usage?: Array<string>;
    argExplanation?: string;

    needsChannel: boolean;
    needsGame: boolean;
    needsPlayer: boolean;
    needsRound: boolean;
    needsActiveTeam: boolean;

    execute(message: Message, args: string[], games: Collection<string, Game>, commands: Collection<string, Command>): any;
}

export { Command }