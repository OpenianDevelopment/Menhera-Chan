import BaseEvent from "../structures/BaseEvent";
import DiscordClient from "../client/client";
import { GuildBan, GuildManager, GuildMember, MessageEmbed } from "discord.js";
import { getAudituser, ModLog } from "../utils/functions/mod";

export default class Event extends BaseEvent {
    constructor() {
        super("guildMemberRemove");
    }
    async run(client: DiscordClient,member:GuildMember) {
        //find a way to see if a memeber was kicked or just left 
        // var data = await getAudituser(member)
        // var reason;
        // if(ban.reason){
        //     reason = ban.reason
        // }else{
        //     reason = "None Given"
        // }
        // var embed = new MessageEmbed()
        // .setTitle("Unbanned")
        // .setColor("RANDOM")
        // .addFields(
        //     {name:"user:",value:`\`${ban.user.username}(${ban.user.id})\``},
        //     data)
        // ModLog(client,ban.guild.id,embed)
    }
}