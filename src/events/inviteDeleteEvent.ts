import BaseEvent from "../structures/BaseEvent";
import DiscordClient from "../client/client";
import { Invite } from "discord.js";

export default class inviteDeleteEvent extends BaseEvent {
    constructor() {
        super("inviteDelete");
    }
    async run(client: DiscordClient, invite: Invite) {
        // ignore if no/unavailable guild
        if (!invite.guild) return;
        // get invites from cache
        let invites = client.getInvites(invite.guild.id);
        // return if no invites
        if (!invites) return;
        // remove if invite exists in cache else return void
        if (invites.includes(invite)) {
            invites.splice(invites.indexOf(invite));
            return;
        } else return;
    }
}
