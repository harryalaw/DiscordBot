const { prefix } = require('../../config.json');
const { MessageEmbed } = require('discord.js');

const footer = `To see other rules messages use ${prefix}rules followed by the corresponding number`;

const moreDetailsFields = [
    // Add a blank buffer to ensure it doesn't align with previous text
    {
        "name": "\u200b",
        "value": "\u200b",
        "inline": false,
    },
    {
        "name": "Other Rules",
        "value": "1️⃣ - Psychic Phase\n2️⃣ - Team Phase\n3️⃣ - Left/Right Phase",
        "inline": true
    },
    {
        "name": "\u200b",
        "value": "4️⃣ - Scoring Phase\n5️⃣ - How Play Continues\n6️⃣ - See all rules",
        "inline": true
    }
]

const embedColor = '#1987DA'

const ruleSummary = [
    {
        "name": "Rules summary",
        "value": "Wavelength is a game where two teams compete to read each other's minds!\n\nTeams take turns rotating a dial to where they think a hidden target is. One player - the Psychic - knows where the target is but can only give a clue that belongs to a specific topic. The topics are spectrums with two opposing concepts on either end - like 'Hot-Cold' or 'Dangerous-Safe'.",
        "inline": false
    },
    {
        "name": "\u200b",
        "value": "The psychic's team get points based on where the dial ends up on the target, and the other team gets an opportunity to guess where the center of the target is compared to the dial in order to get an extra point each round.",
        "inline": false
    },
    {
        "name": "Other help",
        "value": "If you need to know what commands you can use and how to use them, you can type \`${prefix}help\` to see a list of all my commands"
    }
];

const psychicPhase = [
    {
        "name": "1️⃣ - Psychic Phase",
        "value": `Each round the active team will choose a team member to be the psychic for this round. Once you've picked your psychic they should type \`${prefix}start\` to be sent some instructions on how to start a round. Make sure that your psychic has DMs allowed on this server or I won't be able to communicate with them! The psychic will be shown where the target is located and given the choice between a few spectrums that they want to give a clue on.`
    },
    {
        "name": "\u200b",
        "value": "The psychic will then have to think of a thing or an idea that lies in the same place as the target does on the spectrum they have chosen. The clue should try to follow the following rules but don't stress too much about it:"
    },
    {
        "name": "\u200b",
        "value": " - Convey a single thought\n - Must be something that exists\n - Be on topic and be based on that specific spectrum",
        "inline": true
    },
    {
        "name": "\u200b",
        "value": " - Not use synonyms of the words on the prompt\n - Don't use numbers to reflect where the target is",
        "inline": true
    }
];

const teamPhase = [
    {
        "name": "2️⃣ - Team Phase",
        "value": `Once the psychic has shared their clue with the rest of the players their team will be able to move the dial by typing \`${prefix}move degrees\`. Here degrees is the number of degrees you want to move the dial by -- a positive value moves the dial clockwise, a negative value moves the dial anticlockwise.\nOnce the guessing team has moved the dial to where they think the target is, one of the team members should type \`${prefix}lock\` to lock in your answer and move to the next phase of the round.`
    }
];

const leftRightPhase = [
    {
        "name": "3️⃣ - Left/Right Phase",
        "value": `The other team now gets to have a guess if they think that the center of the target is to the left or the right of where the dial is. This team should discuss and once they come to a conclusion they'll be able to vote on which direction. If they guess the direction correctly they will score one point.`
    }
];

const scoringPhase = [
    {
        "name": "4️⃣ - Scoring Phase",
        "value": `After the other team has guessed which direction they think then the target will be revealed to everyone. The guessing team will score points based on which section of the target the dial is on and the other team scores based on whether they guessed left/right correctly. If the guessing team got a perfect guess by scoring 4 points then the other team cannot score 1 point for guessing the direction even if they are correct.`
    }
];

const continuePhase = [
    {
        "name": "5️⃣ - How Play Continues",
        "value": "The game continues like this with each team taking turns until one team reaches 10 points. Then they are the winner! If both teams reach/exceed 10 points in one turn then both teams get one more turn being the psychic each and whoever scores more points in these two rounds wins!"
    },
    {
        "name": "Comeback rule",
        "value": "To allow for an exciting comeback if a team ever gets a perfect guess (scoring 4 points) and is still losing then they take the next turn."
    },
    {
        "name": "Finishing up",
        "value": `I've not yet made it to enforce the 10 point limit so it's up to your discretion when you want to stop playing. If you ever want to start a new game you can reset the score by typing \`${prefix}score set 0 0\` and having both teams confirm it. You can also randomise the teams by typing \`${prefix}changeteam shuffle\`.`
    }
];

const phases = [psychicPhase, teamPhase, leftRightPhase, scoringPhase, continuePhase]

module.exports = {
    name: 'rules',
    description: 'Explains the rules of Wavelength',
    aliases: ['rule'],
    usage: ['', '[ruleNumber]'],
    argExplanation: `Using \`${prefix}rules\` on its own shows a summary, but adding a rule number shows you the relevant rules for the section of the game.`,
    cooldown: 5,
    execute(message, args, games) {
        const { channel } = message;
        let embed = new MessageEmbed()
            .setColor(embedColor)
            .setFooter(footer)
        if (args.length >= 1) {
            if (isNaN(args[0])) return channel.send("You need to provide a number as the first input");
            if (1 <= parseInt(args[0]) && parseInt(args[0]) <= 5) {
                embed.addFields(
                    ...phases[parseInt(args[0]) - 1]
                )
            }
            else if (args[0] === "6") {
                phases.forEach(phase => {
                    embed.addFields(...phase)
                })
            }
            else {
                embed.addField("Invalid input", `You need to provide a valid number as input, like: \`${prefix}rules 3\``, false);
            }
            embed.addFields(
                ...moreDetailsFields
            )
            return channel.send(embed);
        }
        else {
            embed.addFields(
                ...ruleSummary,
                ...moreDetailsFields
            )
            return channel.send(embed);
        }
    }
}

