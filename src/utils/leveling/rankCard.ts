import { rankcardData } from "../interfaces/leveling";
import {
    createCanvas,
    loadImage,
    CanvasRenderingContext2D,
    registerFont,
} from "canvas";
import { MessageAttachment } from "discord.js";
import { readdirSync } from "fs";

export class RankCard {
    private data: rankcardData;

    constructor() {
        this.data = {
            width: 1026,
            height: 285,
            backgroundImage:
                "https://cdn.discordapp.com/attachments/791301593391562752/856879146175954954/rankcard2.png",
            color: {
                main: "#f5deb3",
                track: "#21cc87",
            },
            opacity: 0,
            username: "",
            discriminator: "",
            avatarURL: "",
            font: {
                bold: "Dela_Gothic_One",
                normal: "GothicA1",
            },
            level: 0,
            rank: 0,
            xp: 0,
            MinXP: 0,
            MaxXP: 100,
        };
        const familyName: string[] = ["Dela_Gothic_One", "GothicA1"];
        for (const family of familyName)
            readdirSync(`./././fonts/${family}`)
                .filter((file) => file.endsWith(".ttf"))
                .forEach((file) => {
                    registerFont(`./././fonts/${family}/${file}`, {
                        family: `${family}`,
                    });
                });
    }

    setBackground(imageUrl: string) {
        this.data.backgroundImage = imageUrl;
        return this;
    }

    setUsername(username: string) {
        this.data.username = username;
        return this;
    }

    setDiscriminator(discriminator: string) {
        this.data.discriminator = discriminator;
        return this;
    }

    setTrackColor(color: string) {
        this.data.color.track = color;
        return this;
    }

    setTextColor(color: string) {
        this.data.color.main = color;
        return this;
    }

    setLevel(level: number) {
        this.data.level = level;
        return this;
    }

    setRank(rank: number) {
        this.data.rank = rank;
        return this;
    }

    setXP(xp: number) {
        this.data.xp = xp;
        return this;
    }

    setMinXP(xp: number) {
        this.data.MinXP = xp;
        return this;
    }

    setMaxXP(xp: number) {
        this.data.MaxXP = xp;
        return this;
    }

    setAvatar(url: string) {
        this.data.avatarURL = url;
        return this;
    }

    setOpacity(opacity: number) {
        this.data.opacity = opacity;
        return this;
    }

    async build() {
        const font = this.data.font;
        const color = this.data.color;
        const opacity = this.data.opacity;
        const MaxXp = toAbbrev(this.data.MaxXP),
            Xp = toAbbrev(this.data.xp),
            rank = toAbbrev(this.data.rank);

        let bg = await loadImage(this.data.backgroundImage);
        let avatar = await loadImage(this.data.avatarURL);

        // create canvas instance
        const canvas = createCanvas(this.data.width, this.data.height);
        const ctx = canvas.getContext("2d");

        // create background
        ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

        // add 'whole' overlay
        ctx.fillStyle = "#202225";
        ctx.globalAlpha = opacity;
        roundRect(ctx, 0, 0, canvas.width, canvas.height, 0, true);

        //number bars
        ctx.fillStyle = "#18191c";

        roundRect(
            ctx,
            canvas.width - 330 + 62.5,
            75.5 /*(- 41)*/,
            205,
            32.5 /* (* 2) */,
            7
        ); //* level in box
        roundRect(
            ctx,
            canvas.width - 330 + 62.5,
            195.5 /*(- 41)*/,
            205,
            32.5 /* (* 2) */,
            7
        ); //* rank in box

        // reset transparency
        ctx.globalAlpha = 1;

        // draw username
        ctx.font = `bold 32px ${font.bold}`;
        ctx.fillStyle = color.main;
        ctx.textAlign = "start";
        const name = shorten(this.data.username, 15);

        // apply username
        ctx.fillText(`${name}`, 255.5, 160);

        // draw discriminator
        const discriminator = `${this.data.discriminator}`;
        const nameWidth = ctx.measureText(name).width;
        ctx.font = `28px ${font.normal}`;
        ctx.fillStyle = color.main;
        ctx.textAlign = "center";
        ctx.fillText(`#${discriminator}`, nameWidth + 338, 160);

        //set X Axis
        const XAxis = canvas.width - 165;

        // fill level
        ctx.font = `25px ${font.normal}`;
        ctx.fillStyle = "#b0b0b0";

        ctx.textAlign = "center";
        ctx.fillText("Level:", XAxis, 58);

        //fill level-num
        ctx.font = `bold 25px ${font.bold}`;
        ctx.fillStyle = color.main;
        ctx.textAlign = "center";
        ctx.fillText(this.data.level.toString(), XAxis, 101.5);

        // fill rank
        ctx.font = `25px ${font.normal}`;
        ctx.fillStyle = "#b0b0b0";

        ctx.textAlign = "center";
        ctx.fillText("Rank:", XAxis, 180);

        // fill rank-num
        ctx.font = `bold 25px ${font.bold}`;
        ctx.fillStyle = color.main;
        ctx.textAlign = "center";
        ctx.fillText("#" + rank.toString(), XAxis, 220.5);

        // show Min/Max Xp
        ctx.font = `bold 25px ${font.bold}`;
        ctx.fillStyle = color.main;
        ctx.textAlign = "start";
        ctx.fillText(
            Xp + " / " + MaxXp,
            380 + ctx.measureText(Xp.toString()).width + 25,
            251
        );

        // draw progress-track
        ctx.fillStyle = "black";
        ctx.fillRect(0, 270, 1026, 20);

        // progress-bar
        ctx.fillStyle = color.track;
        ctx.fillRect(
            0,
            270,
            ((this.data.xp - this.data.MinXP) /
                (this.data.MaxXP - this.data.MinXP)) *
                1026,
            20
        );
        ctx.arc(
            ((this.data.xp - this.data.MinXP) /
                (this.data.MaxXP - this.data.MinXP)) *
                1026,
            20,
            8,
            0.5 * Math.PI,
            1.5 * Math.PI,
            true
        );

        ctx.save();

        // Avatar circle
        ctx.beginPath();
        ctx.arc(135, 145, 100, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();

        // draw Avatar
        ctx.drawImage(avatar, 35, 45, 200, 200);
        ctx.restore();

        //return the card
        return new MessageAttachment(
            canvas.toBuffer(),
            `${this.data.username}.png`
        );
    }
}

function shorten(text: string, len: number) {
    if (text.length <= len) return text;
    return text.substr(0, len).trim() + "...";
}

function roundRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number,
    fill: boolean = true,
    stroke: boolean = false
) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    if (fill) {
        ctx.fill();
    }
    if (stroke) {
        ctx.stroke();
    }
    return;
}

function toAbbrev(value: any) {
    let newValue = value;
    if (value >= 1000) {
        const suffixes = ["", "k", "m", "b", "t"];
        const suffixNum = Math.floor(("" + value).length / 3);
        let shortValue: any;
        for (let precision = 2; precision >= 1; precision--) {
            shortValue = parseFloat(
                (suffixNum != 0
                    ? value / Math.pow(1000, suffixNum)
                    : value
                ).toPrecision(precision)
            );
            let dotLessShortValue = (shortValue + "").replace(
                /[^a-zA-Z 0-9]+/g,
                ""
            );
            if (dotLessShortValue.length <= 2) {
                break;
            }
        }
        if (shortValue % 1 != 0) shortValue = shortValue.toFixed(1);
        newValue = shortValue + suffixes[suffixNum];
    }
    return newValue;
}
