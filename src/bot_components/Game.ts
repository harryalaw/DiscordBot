import { GuildMember, Collection, MessageEmbed, Channel } from 'discord.js';
import { Board } from './Board';
import { Util } from '../utility/util';
import { prompts } from './../../assets/text_assets/prompts.json';

export class Game {
    channel: Channel;
    owner: GuildMember;
    players: Collection<GuildMember, number>;
    teams: [Set<string>, Set<string>];
    started: boolean;
    turn: number;
    scoreCap: number;
    scores: [number, number];
    prompt: string[];
    board: Board;
    clueGiver: string | null;


    constructor(channel: Channel, member: GuildMember) {
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
        this.clueGiver = null;
    }

    ///////// Player and team methods
    removePlayer(member: GuildMember) {
        this.teams[this.players.get(member)!].delete(member.id);
        this.players.delete(member);
        // If game owner leaves, reassign to another player, if no players are in the game do nothing.
        if (this.owner.id === member.id && this.players.size >= 1) {
            this.owner = Array.from(this.players.keys())[0];
        }
    }
    addPlayer(member: GuildMember, team: number) {
        this.players.set(member, team)
        this.setTeam(member, team);
        // If game owner no longer in the game assign the game owner to the next person to join
        if (!this.players.has(this.owner)) {
            this.owner = member;
        }
    }

    setTeam(member: GuildMember, team: number = NaN) {
        if (!this.players.has(member)) return;
        if (!isNaN(team)) team %= 2;
        if (team !== 0 && team !== 1) {
            team = this.teams[0].size <= this.teams[1].size ? 0 : 1;
        }
        this.teams[team].add(member.id);
        this.players.set(member, team);
        this.teams[team ^ 1].delete(member.id);
    }

    shuffleTeams() {
        const playerArray: Array<GuildMember> = Array.from(this.players.keys());
        this.teams[0].clear();
        this.teams[1].clear();
        Util.shuffleArray(playerArray);
        playerArray.forEach((member) => {
            this.setTeam(member);
        })
    }
    ///////// Score methods
    setScoreCap(score: number) {
        this.scoreCap = score;
    }

    displayScore() {
        const scoreEmbed: MessageEmbed = new MessageEmbed()
            .setColor(this.board.colors[0])
            .addFields(
                { name: 'Team 1', value: this.scores[0], inline: true },
                { name: 'Team 2', value: this.scores[1], inline: true },
            )
        return scoreEmbed;
    }

    ///////// Prompt methods

    newPrompt() {
        this.prompt = Util.pickRandom(prompts);
        this.board = new Board(this.prompt);
    }

    resetPrompt() {
        this.prompt = ["", ""];
        this.board.setPrompt(["", ""])
    }


    ///// Board reset

    resetBoard() {
        this.resetPrompt();
        this.board.setFanAngle();
        this.board.setNewColors();
    }
}
