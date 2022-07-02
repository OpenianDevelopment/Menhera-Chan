import BaseEvent from "../structures/BaseEvent";
import DiscordClient from "../client/client";
import { Invite } from "discord.js";

export default class inviteCreateEvent extends BaseEvent {
    constructor() {
        super("inviteCreate");
    }
    async run(client: DiscordClient, invite: Invite) {
        // ignore if invite is not in a guild and/or the guild is unavailable
        if (!invite.guild) return;
        // get invites from cache
        let invites = client.getInvites(invite.guild.id);
        // check if cache has anything ;-;
        if (!invites) {
            // set invites to the new invite
            client.invites.set(invite.guild.id, [invite]);
            invites = [invite];
            return;
        }
        if (invites.includes(invite)) {
            // if invite *somehow* exists in cache, ignore
            return;
        } else {
            // push invite to cache
            invites.push(invite);
            return;
        }
    }
}
