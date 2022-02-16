import BaseEvent from "../structures/BaseEvent";
import DiscordClient from "../client/client";
import { GuildEmoji, MessageEmbed } from "discord.js";
import { ModLog } from "../utils/functions/mod";

export default class Event extends BaseEvent {
    constructor() {
        super("emojiDelete");
    }
    async run(client: DiscordClient,emoji:GuildEmoji) {
        var data;
        try{
            var user = (await emoji.guild.fetchAuditLogs({type:12})).entries.first()?.executor
            if(user){
                data = {name:"By User",value:`\`${user.username}(${user.id})\``}
            }else{
                data = {name:"By User",value:`Something went wrong`}
            }
        }catch{
            data = {name:"User",value:"audit log perm is required to veiw this"}
        }
        var embed = new MessageEmbed()
        .setTitle("Emoji Deleted")
        .setColor("RANDOM")
        .setThumbnail(emoji.url)
        .addFields({name:"Role Name:",value:`\`${emoji.name}\``},data)
        ModLog(client,emoji.guild.id,embed)
    }
}