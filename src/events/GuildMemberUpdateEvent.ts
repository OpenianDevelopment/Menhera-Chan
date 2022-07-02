import BaseEvent from "../structures/BaseEvent";
import DiscordClient from "../client/client";
import { GuildMember } from "discord.js";
import { welcomeMsg, welcomeRoles } from "../utils/functions/welcome";
import { sendLog } from "../utils/functions/invites";

export default class GuildMemberAddEvent extends BaseEvent {
    constructor() {
        super("guildMemberUpdate");
    }
    async run(
        client: DiscordClient,
        Oldmember: GuildMember,
        newMember: GuildMember
    ) {
        // if member is bot, ignore
        if (Oldmember.user.bot) return;
        // if member was pending and now is not
        if (Oldmember.pending && !newMember.pending) {
            const { welcomeSettings, inviteLogSettings } =
                client.guildSettings.get(newMember.guild.id)!;
            //invite log function
            await sendLog(client, inviteLogSettings.channelId, newMember);
            // welcome part
            // check if welcome is enabled 
            if (!welcomeSettings.enable) return;
            // send welcome message
            await welcomeMsg(newMember, newMember.guild, welcomeSettings);
            // give welcome roles
            welcomeRoles(client.user!.id, newMember, welcomeSettings);
            return;
        }
    }
}
