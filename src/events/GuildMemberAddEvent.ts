import BaseEvent from "../structures/BaseEvent";
import DiscordClient from "../client/client";
import { GuildMember, MessageEmbed, TextChannel } from "discord.js";
import { getGuildSettings } from "../database/functions/GuildSettingsFunctions";
import { welcomeMsg } from "../utils/functions/welcome";

export default class GuildMemberAddEvent extends BaseEvent {
    constructor() {
        super("guildMemberAdd");
    }
    async run(client: DiscordClient, member: GuildMember) {
        if (member.user.bot) return;
        if (member.pending) return;

        const guildSet = (await getGuildSettings(member.guild.id))
            .welcomeSettings;
        if (!guildSet.enable) return;
        welcomeMsg(member, member.guild, guildSet);

        const welcomeRoles = guildSet.welcomeRoles;
        if (!welcomeRoles) return;
        welcomeRoles.forEach(async (r) => {
            member.roles.add(r).catch(async (e) => {
                if (guildSet.welcomeChannelID === null) return;
                const channel = (await member.guild.channels.fetch(
                    guildSet.welcomeChannelID
                )) as TextChannel;
                if (
                    !channel
                        ?.permissionsFor(client.user!.id)
                        ?.has(`SEND_MESSAGES`)
                )
                    return;
                const embed = new MessageEmbed()
                    .setDescription(
                        `Oh no! Something went wrong while assigning role <@&${r}>. /
                        Make sure i have MANAGE ROLES permission and My role is higher. Thanks in advance honey`
                    )
                    .setColor("RED");
                channel.send({ embeds: [embed] }).catch((err) => {});
            });
        });
    }
}
