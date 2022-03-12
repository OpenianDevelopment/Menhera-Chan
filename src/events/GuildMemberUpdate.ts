import BaseEvent from "../structures/BaseEvent";
import DiscordClient from "../client/client";
import { GuildMember, MessageEmbed, TextChannel } from "discord.js";
import { getGuildSettings } from "../database/functions/GuildSettingsFunctions";
import { welcomeMsg } from "../utils/functions/welcome";

export default class GuildMemberAddEvent extends BaseEvent {
    constructor() {
        super("guildMemberUpdate");
    }
    async run(
        client: DiscordClient,
        Oldmember: GuildMember,
        newMember: GuildMember
    ) {
        if (Oldmember.user.bot) return;
        if (Oldmember.pending && !newMember.pending) {
            const guildSet = (await getGuildSettings(newMember.guild.id))
                .welcomeSettings;
            if (!guildSet.enable) return;
            welcomeMsg(newMember, newMember.guild, guildSet);

            const welcomeRoles = guildSet.welcomeRoles;
            if (!welcomeRoles) return;
            welcomeRoles.forEach(async (r) => {
                newMember.roles.add(r).catch(async (e) => {
                    if (guildSet.welcomeChannelID === null) return;
                    const channel = (await newMember.guild.channels.fetch(
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
}
