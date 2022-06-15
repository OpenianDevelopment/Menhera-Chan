import { BaseMsg } from "../../structures/BaseCommand";
import DiscordClient from "../../client/client";
import { Message, GuildMember, User } from "discord.js";
import { getRolePlayGifs } from "../../database/functions/RolePlayFunctions";
import { CustomEmbed, rpTextCollection } from "../../utils/functions/Custom";

export default class RolePlayCommand extends BaseMsg {
    constructor() {
        super("roleplay", "roleplay message interactions", true, [
            "bully",
            "bite",
            "cry",
            "cuddle",
            "greet",
            "highfive",
            "kill",
            "kiss",
            "pat",
            "tickle",
            "tsundere",
            "yeet",
            "smile",
            "punch",
            "lick",
        ]);
    }
    async run(
        client: DiscordClient,
        message: Message,
        args: string[],
        cmdName: string
    ) {
        if (cmdName == "roleplay") return;
        const author = message.author;
        let members = getMentions(message);
        if (members.length < 1) {
            const embed = new CustomEmbed(message, false).setDescription(
                "You have to mention someone!"
            );
            return await message.reply({ embeds: [embed] });
        }
        // Writing user's message
        let user_msg = getText(message, members[members.length - 1]);
        user_msg ? (user_msg = `~ ` + user_msg) : (user_msg = " ");
        if (user_msg && user_msg.length > 500) {
            user_msg = "||~ Text is too long ||";
        }
        if (members.includes(author)) {
            const embed = new CustomEmbed(message, false).setDescription(
                "You can't roleplay on yourself!"
            );
            return await message.reply({ embeds: [embed] });
        }
        // Defining the embed
        const embed = new CustomEmbed(message);
        // Getting the collection and array
        const textarray = rpTextCollection(
            author.id,
            (members.length > 1
                ? members
                      .filter((u) => u.id != members[members.length - 1].id)
                      .map((u) => u.id)
                      .join(">, <@!") + "> and <@!"
                : "") + members[members.length - 1].id
        ).get(cmdName as RpTypes)!;
        // Choosing text
        const rtxt = textarray[Math.floor(Math.random() * textarray.length)];
        if (cmdName == "tsundere") {
            embed.setDescription(
                `<@!${author.id}> to ${members.map(
                    (m) => `<@!${m.id}>`
                )}:\n**${rtxt}**`
            );
        } else {
            // Getting an img from mongodb
            let data = (await getRolePlayGifs(cmdName))?.get("images");
            if (data == null || undefined) {
                return await message.reply({
                    content: "This interation is currently not working",
                });
            }
            embed
                .setImage(data[Math.floor(Math.random() * data.length)])
                .setDescription(`**${rtxt}** ${user_msg}`);
        }

        return await message.reply({ embeds: [embed] });
    }
}

/**
 *  *"inspired"* by `@Lars_und_so#0666`
 * @param {Message} message
 * @returns Array of users
 */
function getMentions(message: Message) {
    let mentions = [];
    if (message.mentions.repliedUser) {
        mentions.push(message.mentions.repliedUser);
    }
    if (message.mentions.users) {
        mentions = message.mentions.users.map((u) => u);
    }
    return mentions;
}

function getText(message: Message, lastMention: User) {
    return message.content.split(lastMention.id + ">")[1];
}
