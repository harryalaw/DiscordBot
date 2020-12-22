const { Collection } = require('discord.js');
const Util = require('../utility/util.js');
const Board = require('./board.js');
const { prompts } = require('../../assets/prompts.json');
const { roles } = require('../../config.json');

class Game {
    constructor(channel) {
        this.channel = channel;
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

    addPlayer(player, team = undefined) {
        this.players.set(player, team)
        this.setTeam(player, team);
    }

    setTeam(player, team = undefined) {
        if (!this.players.has(player)) return;
        if (!isNaN(team)) team %= 2;
        if (team != 1 || team != 0) {
            team = this.teams[0].size < this.teams[1].size ? 0 : 1;
        }
        this.teams[team].add(player.id);
        this.players.set(player, team);
        this.teams[team ^ 1].delete(player.id);
        // player.roles.set([roles[team]]);
    }

    setScoreCap(score) {
        this.scoreCap = score;
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
}

module.exports = Game;