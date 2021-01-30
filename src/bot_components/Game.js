const { Collection, MessageEmbed } = require('discord.js');
const Util = require('../utility/Util.js');
const Board = require('./board.js');
const { prompts } = require('../../assets/text_assets/prompts.json');

class Game {
    constructor(channel, member) {
        this.channel = channel;
        this.owner = member;
        this.players = new Collection();
        this.teams = [new Set(), new Set()];
        this.started = false;
        this.turn = 0;
        this.scoreCap = 10;
        this.scores = [0, 0];
        this.prompt = ["", ""]
        this.board = new Board(this.prompt);
        this.clueGiver;
    }

    // Add/remove Players (pass in the member value)
    removePlayer(member) {
        this.teams[this.players.get(member)].delete(member.id);
        this.players.delete(member);
        // If game owner leaves, reassign to another player, if no players are in the game do nothing.
        if (this.owner.id === member.id && this.players.size >= 1) {
            this.owner = Array.from(this.players.keys())[0];
        }
    }
    addPlayer(member, team = undefined) {
        this.players.set(member, team)
        this.setTeam(member, team);
        // If game owner no longer in the game assign the game owner to the next person to join
        if (!this.players.has(this.owner)) {
            this.owner = member;
        }
    }

    setTeam(player, team = undefined) {
        if (!this.players.has(player)) return;
        if (!isNaN(team)) team %= 2;
        if (team !== 0 && team !== 1) {
            team = this.teams[0].size <= this.teams[1].size ? 0 : 1;
        }
        this.teams[team].add(player.id);
        this.players.set(player, team);
        this.teams[team ^ 1].delete(player.id);
    }

    setScoreCap(score) {
        this.scoreCap = score;
    }

    displayScore() {
        const scoreEmbed = new MessageEmbed()
            .setColor(this.board.colors[0])
            .addFields(
                { name: 'Team 1', value: this.scores[0], inline: true },
                { name: 'Team 2', value: this.scores[1], inline: true },
            )
        return scoreEmbed;
    }

    shuffleTeams() {
        const playerArray = Array.from(this.players.keys());
        this.teams[0].clear();
        this.teams[1].clear();
        Util.shuffleArray(playerArray);
        playerArray.forEach((member) => {
            this.setTeam(member);
        })
    }

    newPrompt() {
        this.prompt = Util.pickRandom(prompts);
        this.board = new Board(this.prompt);
    }

    resetPrompt() {
        this.prompt = ["", ""];
        this.board.setPrompt(["", ""])
    }
}

module.exports = Game;
