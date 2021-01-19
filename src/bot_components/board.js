const { MessageAttachment } = require('discord.js');
const Jimp = require('jimp');
const { words } = require('../../assets/text_assets/prompts.json');
const ArtAssets = {
    "overlay_open": './assets/art_assets/overlay-open.png',
    "overlay_closed": './assets/art_assets/overlay-closed.png',
    "dial": './assets/art_assets/dial.png',
    "fan": './assets/art_assets/fan.png',
    "background": './assets/art_assets/background.png',
}

class Coordinate {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Board {
    #MAX_ANGLE = 80;
    #MIN_ANGLE = -80;
    // Our overlay wants the circle to placed with center (650,650)
    // The fan has diameter 1102 -> so needs to be placed at 650-551
    #CIRCLE_PLACEMENT = new Coordinate(650 - 551, 650 - 551);
    // each segment of the fan has an angle of 7.5degrees
    #FAN_RANGE = 7;

    #BOX_WIDTH = 340;
    #L_BOX_TL = new Coordinate(310, 580);
    #L_BOX_BR = new Coordinate(650, 800);
    #R_BOX_TL = new Coordinate(650, 580);
    #R_BOX_BR = new Coordinate(990, 800);

    #TEXT_BOX_WIDTH = 240;
    #TEXT_BOX_HEIGHT = 140;
    #L_TEXT_TL = new Coordinate(325, 625);
    #R_TEXT_TL = new Coordinate(735, 625)


    constructor(prompt) {
        this.dialAngle = 0;
        this.fanAngle = -45;
        this.prompt = prompt;
        this.setFanAngle();
    }


    moveDial(angle) {
        this.dialAngle -= angle;
        if (this.dialAngle > this.#MAX_ANGLE) this.dialAngle = this.#MAX_ANGLE;
        if (this.dialAngle < this.#MIN_ANGLE) this.dialAngle = this.#MIN_ANGLE;
    }

    setPrompt(prompt) {
        this.prompt = prompt;
    }

    setFanAngle() {
        const angle = (2 * this.#MAX_ANGLE - this.#FAN_RANGE) * Math.random()
            - (this.#MAX_ANGLE - this.#FAN_RANGE / 2);
        this.fanAngle = angle;
    }

    async makeBoard(isSecret) {
        // Using the flag of false on jimp.rotate stops it resizing the image
        // I've made my assets so that they are contained within the circle 
        // that rotates them so no resizing is necessary
        let out = await Jimp.read(ArtAssets.background);
        if (isSecret) {
            out.blit(await Jimp.read(ArtAssets.overlay_closed), 0, 0);
        } else {
            let fan = await Jimp.read(ArtAssets.fan).then(fan => fan.rotate(this.fanAngle, false));
            out.blit(fan, this.#CIRCLE_PLACEMENT.x, this.#CIRCLE_PLACEMENT.y);
            out.blit(await Jimp.read(ArtAssets.overlay_open), 0, 0);
        }

        let dial = await Jimp.read(ArtAssets.dial).then(dial => dial.rotate(this.dialAngle, false));
        out.blit(dial, this.#CIRCLE_PLACEMENT.x, this.#CIRCLE_PLACEMENT.y);

        await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK).then(font => {
            out.print(font, this.#L_TEXT_TL.x, this.#L_TEXT_TL.y, {
                text: this.prompt[0],
                alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
                alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
            }, this.#TEXT_BOX_WIDTH, this.#TEXT_BOX_HEIGHT);
            out.print(font, this.#R_TEXT_TL.x, this.#R_TEXT_TL.y, {
                text: this.prompt[1],
                alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
                alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
            }, this.#TEXT_BOX_WIDTH, this.#TEXT_BOX_HEIGHT);
        });

        return out;
    }

    async bufferImage(isSecret) {
        const image = await this.makeBoard(isSecret);
        const buffer = await image.getBufferAsync(Jimp.MIME_PNG);
        const attachment = new MessageAttachment(buffer, "board.png");
        return attachment;
    }

    async sendAsMessage(isSecret, channel, message) {
        const attachment = await this.bufferImage(isSecret);
        if (!message) channel.send(attachment);
        else channel.send(message, { files: [attachment] });
        return attachment;
    }
}

module.exports = Board;