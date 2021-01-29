module.exports = class Util {
    static pickRandom(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    static sample(array, number) {
        this.shuffleArray(array);
        return array.slice(0, number);
    }

    static shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    static getName(member) {
        return member.nickname ? member.nickname : member.user.username;
    }

    //returns true if score1,score2 are invalid scores, else false;
    static invalidScores(score1, score2, scorecap) {
        if (isNaN(score1) || isNaN(score2)) return true;
        else if (Math.floor(score1) != score1 || Math.floor(score2) != score2) return true;
        else if (score1 < 0 || score1 >= scorecap || score2 < 0 || score2 >= scorecap) return true;
        return false;
    }

    static reactionFilter(reactions) {
        return function (reaction, user) {
            return reactions.includes(reaction.emoji.name) && !user.bot;
        }
    }

    static reactionFilterOneTeam(reactions, game, activeTeam) {
        const adjust = activeTeam === true ? 0 : 1;
        return function (reaction, user) {
            console.log(adjust);
            console.log(reaction.emoji.name, game.teams[game.turn ^ adjust].has(user.id));
            return reactions.includes(reaction.emoji.name) && game.teams[game.turn ^ adjust].has(user.id);
        }
    }
}
