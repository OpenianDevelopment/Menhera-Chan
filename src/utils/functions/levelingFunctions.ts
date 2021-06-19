import {
	Message,
	MessageEmbed,
	Snowflake,
	TextChannel,
	User,
	MessageAttachment,
} from "discord.js";
import { createCanvas, loadImage } from "canvas";
import DiscordClient from "../../client/client";
import { userXP } from "../interfaces/levelingInterfaces";
import { ssn } from "./utilityFunctions";

export function sendLevelUpMessage(
	client: DiscordClient,
	message: Message,
	level: number
) {
	const embed = new MessageEmbed()
		.setColor("#554b58")
		.setTitle(message.member?.displayName || message.author.username)
		.addField("**Congrats**", `You are now level **${level}**`)
		.setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
		.setFooter(message.guild?.name || "");

	const { xplog } = client.guildConfig.get(message.guild?.id);
	if (!xplog) {
		message.channel.send({
			content: `<@${message.author.id}>`,
			embeds: [embed],
		});
	} else {
		const channel = client.channels.cache.get(
			xplog as Snowflake
		) as TextChannel;
		if (!channel) {
			message.channel.send({
				content: `<@${message.author.id}>`,
				embeds: [embed],
			});
		} else {
			channel.send({
				content: `<@${message.author.id}>`,
				embeds: [embed],
			});
		}
	}
}

export async function getRankCard(
	user: User,
	userDetail: userXP,
	rank: number
) {
	const canvas = createCanvas(1026, 285);
	const ctx = canvas.getContext("2d");
	const background = loadImage(
		"https://cdn.discordapp.com/attachments/851062487977951256/854374390694281216/rankcard.png"
	);
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

	ctx.fillStyle = "#21cc87";
	ctx.globalAlpha = 1;
	ctx.fillRect(
		0,
		270,
		((userDetail.xp - userDetail.minxp) /
			(userDetail.maxxp - userDetail.minxp)) *
			1026,
		20
	);
	ctx.fill();
	ctx.globalAlpha = 1;

	ctx.font = "bold 25px Arial";
	ctx.textAlign = "center";
	ctx.fillStyle = "#4a5072";
	ctx.fillText(`XP: ${ssn(userDetail.xp)}/${ssn(userDetail.maxxp)}`, 513, 260);

	ctx.textAlign = "center";
	ctx.fillText(`Level: ${userDetail.level}`, 513, 220);

	ctx.font = "bold underline 35px Arial";
	ctx.textAlign = "left";
	ctx.fillText(`${user.tag}`, 330, 145);

	ctx.arc(170, 135, 125, 0, Math.PI * 2, true);
	ctx.lineWidth = 6;
	ctx.strokeStyle = "#ffffff";
	ctx.stroke();
	ctx.closePath();
	ctx.clip();

	const avatar = await loadImage(user.displayAvatarURL({ format: "png" }));
	ctx.drawImage(avatar, 45, 10, 250, 250);

	const attachment = new MessageAttachment(canvas.toBuffer(), "rankcard.png");
	return attachment;
}
