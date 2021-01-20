const { prefix } = require('../../config.json')

module.exports = {
    name: 'rules',
    description: 'Explains the rules of Wavelength',
    execute(message, args, games) {
        const { channel } = message;
        let data = [];
        data.push(`Each round one player will elect themselves as the psychic by typing \`${prefix}start\`. They will then be shown where the target is and given the choice between some topics they can give the clue on. The topics represent a spectrum with two opposing concepts on each end - "Hot-Cold" or "Dangerous-Safe".`);
        channel.send(data)
        data = [];

        data.push(`Once the psychic has chosen the topic they will need to come up with a clue they can use to try to get their team to move the dial so that it ends up on the target. The psychic should think of a thing or an idea that lies there on the spectrum they have chosen.`);
        data.push(`The clue should try to these rules:`);
        data.push(` - Convey a single thought`);
        data.push(` - Must be something that exists`);
        data.push(` - Be on topic and be based on that specific spectrum`);
        data.push(` - Not use synonyms of the words on the prompt`);
        data.push(` - Don't use numbers to reflect where the target is`);
        channel.send(data);

        data = [];
        data.push(`The psychic should then share the clue to their team who will then be able to move the dial by typing \`${prefix}move degrees\` where degrees is the number of degrees you want to move it by. Here a positive value for degrees will move the dial clockwise, and a negative value anticlockwise.`);
        data.push(`Once the team has moved the dial to where they think it should be, the cluegiver should type \`${prefix}reveal\` to trigger the end of the round.`);
        data.push(`The other team now gets to have a guess if they think that the center of the target is to the left or the right of the target. They should discuss and once they decide they'll be able to vote on which direction. If they guess correctly they will score one point.`)
        data.push(`Then the correct position will be revealed to everyone and the guessing team will score points based on where the dial is on the target.`);
        data.push(`Teams should take turns giving clues until one team reaches 10 points, then that team is the winner! If both teams reach 10 points during the same round they should each take one final turn at giving a clue to see who scores more points. If the losing team gets a perfect guess and scores 4 points and are still losing then they get to take another turn.`);

        channel.send(data);
    }
}