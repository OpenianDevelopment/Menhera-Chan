import BaseEvent from "../structures/BaseEvent";
import DiscordClient from "../client/client";
import { GuildChannel,MessageEmbed} from "discord.js";
import { ModLog } from "../utils/functions/mod";

export default class Event extends BaseEvent {
    constructor() {
        super("channelDelete");
    }
    async run(client: DiscordClient,channel:GuildChannel) {
        var data;
        try{
            var user = (await channel.guild.fetchAuditLogs({type:12})).entries.first()?.executor
            if(user){
                data = {name:"By User",value:`\`${user.username}(${user.id})\``}
            }else{
                data = {name:"By User",value:`Something went wrong`}
            }
        }catch{
            data = {name:"User",value:"audit log perm is required to veiw this"}
        }
        var embed = new MessageEmbed()
        .setTitle("Channel Deleted")
        .setColor("RANDOM")
        .addFields({name:"Channel Name:",value:`\`${channel.name}\``},{name:"Channel ID:",value:`\`${channel.id}\``},data)
        ModLog(client,channel.guildId,embed)
    }
}