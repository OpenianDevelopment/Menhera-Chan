import BaseEvent from "../structures/BaseEvent";
import DiscordClient from "../client/client";
import { GuildMember } from "discord.js";
import { welcomeMsg, welcomeRoles } from "../utils/functions/welcome";
import { sendLog } from "../utils/functions/invites";

export default class GuildMemberAddEvent extends BaseEvent {
    constructor() {
        super("guildMemberAdd");
    }
    async run(client: DiscordClient, member: GuildMember) {
        // ignore if member is bot or pending
        if (member.user.bot) return;
        if (member.pending) return;
        const { welcomeSettings, inviteLogSettings } = client.guildSettings.get(
            member.guild.id
        )!;
        // invite log function
        await sendLog(client, inviteLogSettings.channelId, member);
        // welcome part
        if (!welcomeSettings.enable) return;
        // send welcome message
        await welcomeMsg(member, member.guild, welcomeSettings);
        // give welcome roles
        welcomeRoles(client.user!.id, member, welcomeSettings);
        return;
    }
}
