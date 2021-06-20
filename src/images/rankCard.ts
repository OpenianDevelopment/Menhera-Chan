import { rankcardData } from "../utils/interfaces/levelingInterfaces";
import { createCanvas, loadImage } from "canvas";
import { MessageAttachment } from "discord.js";
export class RankCard {
	private data: rankcardData;
	constructor() {
		this.data = {
			width: 1026,
			height: 285,
			backgroundImage:
				"https://cdn.discordapp.com/attachments/851062487977951256/854374390694281216/rankcard.png",

			trackColor: "#21cc87",
			textColor: "#554b58",
			username: "",
			discrim: "",
			avatarURL: "",
			font: "bold 25px Arial",
			level: 0,
			rank: 0,
			xp: 0,
			MinXP: 0,
			MaxXP: 100,
		};
	}
	setBackground(imageUrl: string) {
		this.data.backgroundImage = imageUrl;
		return this;
	}
	setUsername(username: string) {
		this.data.username = username;
		return this;
	}
	setDiscrim(discrim: string) {
		this.data.discrim = discrim;
		return this;
	}
	setTrackColor(color: string) {
		this.data.trackColor = color;
		return this;
	}
	setTextColor(color: string) {
		this.data.textColor = color;
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

	async build() {
		const canvas = createCanvas(this.data.width, this.data.height);
		const ctx = canvas.getContext("2d");
		const background = await loadImage(this.data.backgroundImage);
		ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
		ctx.beginPath();
		ctx.lineWidth = 4;
		ctx.strokeStyle = "#000000";
		ctx.globalAlpha = 1;
		ctx.fillStyle = "#000000";
		ctx.fillRect(0, 270, 1026, 20);
		ctx.fill();
		ctx.globalAlpha = 1;
		ctx.stroke();

		ctx.fillStyle = this.data.trackColor;
		ctx.globalAlpha = 1;
		ctx.fillRect(
			0,
			270,
			((this.data.xp - this.data.MinXP) / (this.data.MaxXP - this.data.MinXP)) *
				1026,
			20
		);
		ctx.fill();
		ctx.globalAlpha = 1;

		ctx.font = this.data.font;
		ctx.textAlign = "center";
		ctx.fillStyle = this.data.textColor;
		ctx.fillText(`XP: ${ssn(this.data.xp)}/${ssn(this.data.MaxXP)}`, 513, 260);

		ctx.textAlign = "center";
		ctx.fillText(`Level: ${this.data.level}`, 513, 220);

		ctx.font = "bold underline 35px Arial";
		ctx.textAlign = "left";
		ctx.fillText(
			`${shorten(this.data.username, 10)}#${this.data.discrim}`,
			330,
			145
		);

		ctx.arc(170, 135, 125, 0, Math.PI * 2, true);
		ctx.lineWidth = 6;
		ctx.strokeStyle = this.data.textColor;
		ctx.stroke();
		ctx.closePath();
		ctx.clip();

		const avatar = await loadImage(this.data.avatarURL);
		ctx.drawImage(avatar, 45, 10, 250, 250);

		const attachment = new MessageAttachment(canvas.toBuffer(), "rankcard.png");
		return attachment;
	}
}
function shorten(text: string, len: number) {
	if (typeof text !== "string") return "";
	if (text.length <= len) return text;
	return text.substr(0, len).trim() + "...";
}

function ssn(n: number) {
	if (n <= 1e4) {
		return n;
	}
	if (n <= 1e6) {
		return (n / 1e3).toFixed(1) + "k";
	}
	if (n <= 1e9) {
		return (n / 1e6).toFixed(2) + "m";
	}

	return n;
}
