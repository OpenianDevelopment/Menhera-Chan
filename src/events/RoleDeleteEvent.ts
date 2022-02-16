import BaseEvent from "../structures/BaseEvent";
import DiscordClient from "../client/client";
import { MessageEmbed, Role } from "discord.js";
import { ModLog } from "../utils/functions/mod";

export default class Event extends BaseEvent {
    constructor() {
        super("roleDelete");
    }
    async run(client: DiscordClient,role:Role) {
        var data;
        try{
            var user = (await role.guild.fetchAuditLogs({type:12})).entries.first()?.executor
            if(user){
                data = {name:"By User",value:`\`${user.username}(${user.id})\``}
            }else{
                data = {name:"By User",value:`Something went wrong`}
            }
        }catch{
            data = {name:"User",value:"audit log perm is required to veiw this"}
        }
        var embed = new MessageEmbed()
        .setTitle("Role Deleted")
        .setColor("RANDOM")
        .addFields({name:"Role Name:",value:`\`${role.name}\``},data)
        ModLog(client,role.guild.id,embed)
    }
}