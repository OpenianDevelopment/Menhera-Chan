import {
	MessageEmbed,
	Snowflake,
	TextChannel,
	User,
	UserResolvable,
} from "discord.js";
import DiscordClient from "../../client/client";

export function sendModLogs(
	client: DiscordClient,
	title: string,
	author: User,
	user: User,
	reason: string,
	guildId?: string,
	time?: number
) {
	const embed = new MessageEmbed()
		.setColor("#554b58")
		.setAuthor(
			`${title} | ${user.tag}`,
			user.displayAvatarURL({ dynamic: true })
		)
		.addField("User:", `<@${user.id}>`, true)
		.addField("Moderator:", `<@${author.id}>`, true)
		.setTimestamp()
		.setFooter(user.id);

	if (reason) {
		embed.addField("Reason", reason, true);
	}
	if (time) {
		embed.addField("Time:", new Date(time).toISOString().substr(11, 8), true);
	}

	const { logchannel } = client.guildConfig.get(guildId);
	if (!logchannel) return;
	const channel = client.channels.cache.get(
		logchannel as Snowflake
	) as TextChannel;
	channel.send({ embeds: [embed] });
}
