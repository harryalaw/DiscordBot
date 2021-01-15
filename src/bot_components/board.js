const { MessageAttachment } = require('discord.js');
const Jimp = require('jimp');
const { words } = require('../../assets/prompts.json');

class Coordinate {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Board {
    #MAX_ANGLE = 80;
    #MIN_ANGLE = -80;
    #CIRCLE_PLACEMENT = new Coordinate(298, 217);

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
        const angle = 153 * Math.random() - 76.5;
        this.fanAngle = angle;
    }

    async makeBoard(isSecret) {
        // Using the flag of false on jimp.rotate stops it resizing the image
        // I've made my assets so that they are contained within the circle 
        // that rotates them so no resizing is necessary
        let out = await Jimp.read('./assets/background.png');
        if (isSecret) {
            out.blit(await Jimp.read('./assets/overlay-closed.png'), 0, 0);
        } else {
            let fan = await Jimp.read('./assets/fan4.png').then(fan => fan.rotate(this.fanAngle, false));
            out.blit(fan, this.#CIRCLE_PLACEMENT.x, this.#CIRCLE_PLACEMENT.y);
            out.blit(await Jimp.read('./assets/overlay.png'), 0, 0);
        }

        let dial = await Jimp.read('./assets/dialandnub1.png').then(dial => dial.rotate(this.dialAngle, false));
        out.blit(dial, this.#CIRCLE_PLACEMENT.x, this.#CIRCLE_PLACEMENT.y);

        await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK).then(font => {
            out.print(font, 560, 780, {
                text: this.prompt[0],
                alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
                alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
            }, 240, 100);
            out.print(font, 900, 780, {
                text: this.prompt[1],
                alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
                alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
            }, 240, 100);
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