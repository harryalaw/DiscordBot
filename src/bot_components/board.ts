import { TextChannel, Message, MessageAttachment, DMChannel, NewsChannel } from 'discord.js';
import Jimp from 'jimp';

import { colors } from './../../assets/text_assets/colors.json';
import { Coordinate } from '../utility/coordinate';
import { Wordboard } from './../bot_components/Wordboard';
import { Util } from '../utility/util';

const ArtAssets = {
    "background_open": './assets/art_assets/650x400/background-open.png',
    "background_closed": './assets/art_assets/650x400/background-closed.png',
    "dial": './assets/art_assets/650x400/dial.png',
    "fan": './assets/art_assets/650x400/fan.png',
    "overlay": './assets/art_assets/650x400/overlay.png',
    "left_arrow": './assets/art_assets/650x400/left_arrow.png',
    "right_arrow": './assets/art_assets/650x400/right_arrow.png',
}

export class Board {
    dialAngle: number;
    fanAngle: number;
    prompt: [string, string];
    colors: Array<string>;
    #MAX_ANGLE = 80;
    #MIN_ANGLE = -80;
    // each segment of the fan has an angle of 7 degrees
    #FAN_RANGE = 7;
    //////////////////////////////////
    // The following variables are the 2D coordinates that I use to stitch the image together
    // Our overlay wants the circle to placed with center (325,325)
    // The fan has diameter 551 -> so needs to be placed at 325-275.5
    #CIRCLE_PLACEMENT: Coordinate = { x: 325 - 275.5, y: 325 - 275.5 };

    #BOX_WIDTH = 170;
    #BOX_HEIGHT = 110;
    #L_BOX_TL: Coordinate = { x: 155, y: 290 };
    #L_BOX_BR: Coordinate = { x: 325, y: 400 };
    #R_BOX_TL: Coordinate = { x: 325, y: 290 };
    #R_BOX_BR: Coordinate = { x: 495, y: 400 };

    #L_ARROW_TL: Coordinate = { x: 198, y: 312 };
    #R_ARROW_TL: Coordinate = { x: 388, y: 312 }

    #TEXT_BOX_WIDTH = 120;
    #TEXT_BOX_HEIGHT = 70;
    // Coordinates of text box corners are relative to the wordbox;
    #L_TEXT_TL: Coordinate = { x: 7.5, y: 22.5 };
    #R_TEXT_TL: Coordinate = { x: 170 + 42.5, y: 22.5 };
    ////////////////////////////////////////////////////

    constructor(prompt: [string, string]) {
        this.dialAngle = 0;
        this.fanAngle = 0;
        this.prompt = prompt;
        this.setFanAngle();
        this.colors = ["", ""];
        this.setNewColors();
    }


    moveDial(angle: number) {
        this.dialAngle -= angle;
        if (this.dialAngle > this.#MAX_ANGLE) this.dialAngle = this.#MAX_ANGLE;
        if (this.dialAngle < this.#MIN_ANGLE) this.dialAngle = this.#MIN_ANGLE;
    }

    setPrompt(prompt: [string, string]) {
        this.prompt = prompt;
    }

    setFanAngle() {
        const angle = (2 * this.#MAX_ANGLE - this.#FAN_RANGE) * Math.random()
            - (this.#MAX_ANGLE - this.#FAN_RANGE / 2);
        this.fanAngle = angle;
    }

    setNewColors() {
        this.colors = Util.sample(colors, 2);
    }


    async makeBoard(isSecret: boolean) {
        let out;
        if (isSecret) {
            out = await Jimp.read(ArtAssets.background_closed);
        } else {
            out = await Jimp.read(ArtAssets.background_open);
            // Using the flag of false on jimp.rotate stops it resizing the image
            // I've made my assets so that they are contained within the circle 
            // that rotates them so no resizing is necessary
            let fan = await Jimp.read(ArtAssets.fan).then(fan => fan.rotate(this.fanAngle, false));
            out.blit(fan, this.#CIRCLE_PLACEMENT.x, this.#CIRCLE_PLACEMENT.y);
        }

        out.blit(await Jimp.read(ArtAssets.overlay), 0, 0);

        let wordboard = new Wordboard(this.colors, this.prompt, this.#BOX_WIDTH * 2,
            this.#BOX_HEIGHT, this.#TEXT_BOX_WIDTH, this.#TEXT_BOX_HEIGHT,
            this.#L_TEXT_TL, this.#R_TEXT_TL)

        out.blit(await Jimp.read(wordboard.canvas.toBuffer()), this.#L_BOX_TL.x, this.#L_BOX_TL.y);
        out.blit(await Jimp.read(ArtAssets.left_arrow), this.#L_ARROW_TL.x, this.#L_ARROW_TL.y);
        out.blit(await Jimp.read(ArtAssets.right_arrow), this.#R_ARROW_TL.x, this.#R_ARROW_TL.y);

        let dial = await Jimp.read(ArtAssets.dial).then(dial => dial.rotate(this.dialAngle, false));
        out.blit(dial, this.#CIRCLE_PLACEMENT.x, this.#CIRCLE_PLACEMENT.y);

        return out;
    }

    async bufferImage(isSecret: boolean) {
        const image = await this.makeBoard(isSecret);
        const buffer = await image.getBufferAsync(Jimp.MIME_PNG);
        const attachment = new MessageAttachment(buffer, "board.png");
        return attachment;
    }

    async sendAsMessage(isSecret: boolean, channel: TextChannel | DMChannel | NewsChannel, message?: Message) {
        const attachment = await this.bufferImage(isSecret);
        if (!message) channel.send(attachment);
        else channel.send(message, { files: [attachment] });
        return attachment;
    }
}