import { Canvas, createCanvas, CanvasRenderingContext2D } from "canvas";
import { Coordinate } from "../utility/coordinate";


export class Wordboard {
    colors: string[];
    prompts: [string, string];
    textBoxWidth: number;
    textBoxHeight: number;
    textBoxTLCoords: [Coordinate, Coordinate];
    canvas: Canvas;
    context: CanvasRenderingContext2D;

    constructor(colors: string[], prompt: [string, string], width: number, height: number,
        textBoxWidth: number, textBoxHeight: number, L_TEXT_TL: Coordinate, R_TEXT_TL: Coordinate) {

        // colors will be of the shape [string,string] but couldn't figure out how to type Util.sample to allow that
        this.colors = colors;
        this.prompts = prompt;
        this.textBoxWidth = textBoxWidth;
        this.textBoxHeight = textBoxHeight;
        this.textBoxTLCoords = [L_TEXT_TL, R_TEXT_TL];
        this.canvas = createCanvas(width, height);
        this.context = this.canvas.getContext('2d');
        this.drawBoard(width, height);

    }

    drawBoard(width: number, height: number) {
        this.colors.forEach((color, index) => {
            this.context.fillStyle = color;
            this.context.fillRect(index * width / 2, 0, width / 2, height);
        });
        // this.prompts = this.prompts.map(prompt => this.breakLines(prompt))

        let parsedPrompts: string[][] = this.prompts.map(prompt => this.breakLines(prompt));
        this.resizeText(parsedPrompts);
        parsedPrompts.forEach((promptLines, index) => {
            this.context.fillStyle = '#000';
            this.context.textAlign = "center";
            this.context.textBaseline = "middle";
            let textBoxCoords = this.textBoxTLCoords[index];

            // let parsedPrompt = this.breakLines(prompt);
            promptLines.forEach((prompt, index) => {
                this.context.fillText(prompt, textBoxCoords.x + this.textBoxWidth / 2,
                    textBoxCoords.y + this.textBoxHeight / 2 + index * 25, this.textBoxWidth);
            });
        })
    }
    resizeText(text: string[][]) {
        // If one line in the parsed prompts is too long scales down the text 
        //until it all fits in the text box
        const lines = text[0].concat(text[1]);
        this.context.font = "24px Impact";
        let fontsize = 24;
        lines.forEach(line => {
            while (this.context.measureText(line).width > this.textBoxWidth && fontsize > 16) {
                this.context.font = `${--fontsize}px Impact`;
            }
        })
    }

    breakLines(prompt: string): [string] | [string, string] {
        if (prompt === '') return [''];
        const words = prompt.split(' ');
        if (words.length === 1) {
            return [prompt];
        }
        else {
            // Balance the string lengths so that the text wraps
            // with the top string favoured to be longer
            const wordLengths = words.map(word => word.length);
            let leftLength = wordLengths[0];
            let smallestLength = Math.min(...wordLengths);

            // -1 for removing the space as well at the start
            let rightLength = prompt.length - wordLengths[0] - 1;
            let smallestDelta = Math.abs(leftLength - rightLength);
            let pivotIndex = 1;

            for (let i = 1; i < wordLengths.length - 1; i++) {
                leftLength += (wordLengths[i] + 1);
                rightLength -= (wordLengths[i] + 1);
                if (Math.abs(leftLength - rightLength) < smallestDelta + smallestLength) {
                    smallestDelta = Math.abs(leftLength - rightLength);
                    pivotIndex = i + 1;
                }
            }
            let topString = words.slice(0, pivotIndex).join(' ');
            let botString = words.slice(pivotIndex,).join(' ');
            return [topString, botString];
        }
    }
}