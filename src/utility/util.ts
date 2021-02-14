import { EmojiResolvable, GuildMember, Message, MessageReaction, User } from "discord.js";
import { Game } from "../bot_components/Game";

class Util {
    static pickRandom<T>(array: Array<T>) {
        return array[Math.floor(Math.random() * array.length)];
    }

    // Samples n items from an array
    static sample<T>(array: Array<T>, n: number) {
        this.shuffleArray(array);
        return array.slice(0, n);
    }

    static shuffleArray<T>(array: Array<T>) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    static getName(member: GuildMember) {
        return member.nickname ? member.nickname : member.user.username;
    }

    //returns true if score1,score2 are invalid scores, else false;
    static invalidScores(score1: number, score2: number, scorecap: number) {
        if (isNaN(score1) || isNaN(score2)) return true;
        else if (Math.floor(score1) != score1 || Math.floor(score2) != score2) return true;
        else if (score1 < 0 || score1 >= scorecap || score2 < 0 || score2 >= scorecap) return true;
        return false;
    }

    static reactionFilter(reactions: Array<string>) {
        return function (reaction: MessageReaction, user: User) {
            return reactions.includes(reaction.emoji.name) && !user.bot;
        }
    }

    static reactionFilterOneTeam(reactions: Array<string>, game: Game, responseFromActiveTeam: boolean) {
        const adjust = responseFromActiveTeam === true ? 0 : 1;
        return function (reaction: MessageReaction, user: User) {
            return reactions.includes(reaction.emoji.name) && game.teams[game.turn ^ adjust].has(user.id);
        }
    }
}

export { Util }

export const addReactionsToMessage = (emojis: EmojiResolvable[], msg: Message) => {
    const reactions = [];
    for (const emoji of emojis) {
        reactions.push(msg.react(emoji));
    }
    return Promise.all(reactions);
}