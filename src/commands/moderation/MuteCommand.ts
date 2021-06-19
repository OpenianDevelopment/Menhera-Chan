import { Message, MessageEmbed, Snowflake } from "discord.js";
import DiscordClient from "../../client/client";
import { BaseCommand } from "../../utils/structures";
import ms from "ms";
import { sendModLogs } from "../../utils/functions/modFunction";
import {
	addModerations,
	updateModerations,
} from "../../database/functions/modOperation";
export default class MuteCommand extends BaseCommand {
	constructor() {
		super(
			"mute",
			"Mute a user",
			"moderation",
			[],
			"mute <user> [Time] [Reason]",
			"mute J0K3R#1141 12h spamming"
		);
	}

	async run(client: DiscordClient, message: Message, args: Array<string>) {
		if (!message.member?.permissions.has("MANAGE_MESSAGES")) return;
		if (!message.guild?.me?.permissions.has("MANAGE_ROLES")) {
			const embed = new MessageEmbed()
				.setColor("RED")
				.setDescription("❌ I don't have `Manage Roles` Permission");
			message.reply({ embeds: [embed] });
			return;
		}
		if (!args.length) {
			const embed = new MessageEmbed()
				.setColor("RED")
				.setDescription("❌ Please provide a user to mute");
			message.reply({ embeds: [embed] });
			return;
		}
		const member =
			message.mentions.members?.first() ||
			(await message.guild?.members
				.fetch(
					isNaN(parseInt(args[0]))
						? { user: message, query: args[0], limit: 1 }
						: (args[0] as Snowflake)
				)
				.catch((err) => {
					return null;
				}));
		if (!member) {
			const embed = new MessageEmbed()
				.setColor("RED")
				.setDescription("❌ I can't find this user");
			message.reply({ embeds: [embed] });
			return;
		}
		if (!member.manageable) {
			const embed = new MessageEmbed()
				.setColor("RED")
				.setDescription(
					`❌ ${member.user.username} has higher position than mine`
				);
			message.reply({ embeds: [embed] });
			return;
		}
		const { muterole } = client.guildConfig.get(message.guild?.id);
		if (!muterole || !message.guild.roles.cache.has(muterole as Snowflake)) {
			const embed = new MessageEmbed()
				.setColor("RED")
				.setDescription(
					"❌ Mute Role has been not setup for this server. Please visit [Dashboard](https://dashboard.menhera-chan.in/) to set it up"
				);
			message.reply({ embeds: [embed] });
			return;
		}

		if (member.roles.cache.has(muterole)) {
			const embed = new MessageEmbed()
				.setColor("RED")
				.setDescription(`❌ ${member.user.username} is already muted`);
			message.reply({ embeds: [embed] });
			return;
		}
		const time = ms(args[1]);

		if (time) {
			const reason = args.slice(2).join(" ") || "No Reason Provided";
			member.roles.add(muterole as Snowflake, reason).catch((err) => {
				const embed = new MessageEmbed()
					.setColor("RED")
					.setDescription(
						"❌ I am not able to mute. Make sure my role is higher than mute role"
					);
				message.reply({ embeds: [embed] });
				return;
			});
			const embed = new MessageEmbed()
				.setColor("#554b58")
				.setDescription(`**${member.user.username} muted**`);
			message.reply({ embeds: [embed] });
			member
				.send(
					`You have been muted on ${
						message.guild?.name
					} for Reason: ${reason}\nTime Left: ${new Date(time)
						.toISOString()
						.substr(11, 8)}`
				)
				.catch((err) => {
					message.channel.send(
						"❌ User DM seems to be closed. So i couldn't inform them the reason"
					);
				});
			sendModLogs(
				client,
				"Mute",
				message.author,
				member.user,
				reason,
				message.guild?.id,
				time
			);

			const mute_id = await addModerations(
				message.guild.id,
				member.user,
				"mute",
				time + new Date().getTime()
			);
			setTimeout(async () => {
				const MuteStatus = await updateModerations(mute_id, message.guild?.id);
				if (!MuteStatus) return;
				member.roles.remove(muterole as Snowflake, reason).catch((err) => {
					const embed = new MessageEmbed()
						.setColor("RED")
						.setDescription(
							"❌ I am not able to unmute. Make sure my role is higher than mute role"
						);
					message.reply({ embeds: [embed] });
				});
				sendModLogs(
					client,
					"Unmute",
					client.user || message.author,
					member.user,
					"Mute Expired",
					message.guild?.id
				);
			}, time);
			return;
		}
		const reason = args.slice(1).join(" ") || "No Reason Provided";
		member.roles.add(muterole as Snowflake, reason).catch((err) => {
			const embed = new MessageEmbed()
				.setColor("RED")
				.setDescription(
					"❌ I am not able to mute. Make sure my role is higher than mute role"
				);
			message.reply({ embeds: [embed] });
			return;
		});
		const embed = new MessageEmbed()
			.setColor("#554b58")
			.setDescription(`**${member.user.username} muted**`);
		message.reply({ embeds: [embed] });
		member
			.send(
				`You have been muted on ${message.guild?.name} for Reason: ${reason}`
			)
			.catch((err) => {
				message.channel.send(
					"❌ User DM seems to be closed. So i couldn't inform them the reason"
				);
			});
		sendModLogs(
			client,
			"Mute",
			message.author,
			member.user,
			reason,
			message.guild?.id
		);
	}
}
