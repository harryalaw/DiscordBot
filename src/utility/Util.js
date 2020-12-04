module.exports = class Util {
    // static countVotes(votes) {
    //     let isUnique = true;
    //     let mostVotes = 0;
    //     let mostEmoji;
    //     for (const [emoji, voteCount] of votes) {
    //         if (voteCount > mostVotes) {
    //             mostVotes = voteCount;
    //             mostEmoji = emoji;
    //             isUnique = true;
    //         }
    //         else if (voteCount == mostVotes) {
    //             isUnique = false;
    //         }
    //     }
    //     return isUnique === true ? mostEmoji : "Tie";

    // }

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
}