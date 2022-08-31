import CommandInt from "../../structures/BaseCommand";
import DiscordClient from "../../client/client";
import { CommandInteraction } from "discord.js";
import type { MessageEmbedOptions } from "discord.js";
import { addGuildTag } from "../../database/functions/TagsFunctions";
import { CheckPerms } from "../../utils/functions/mod";
import config from "../../utils/config";
import { ReportBug } from "../../utils/functions/Custom";

const TagCreate: CommandInt = {
    name: "tag create",
    description: "Create a tag",
    async run(
        client: DiscordClient,
        interaction: CommandInteraction<"cached">
    ) {
        if (
            !(await CheckPerms(
                interaction,
                interaction.user.id,
                "MANAGE_MESSAGES"
            ))
        ) {
            return;
        }
        const longname = interaction.options
            .getString("name", true)
            .toLowerCase();
        const reply = interaction.options.getBoolean("reply", true);
        const content =
            interaction.options.getString("content", false) || undefined;
        const embed: MessageEmbedOptions | undefined =
            interaction.options.getString("embed", false)
                ? JSON.parse(interaction.options.getString("embed", false)!)
                : null;
        const name = longname.split(/ /g)[0];
        if (!content && !embed) {
            await interaction.reply({
                content: "You have to either add **content** or **embed**",
                ephemeral: true
            });
            return;
        }
        if (
            await addGuildTag(
                interaction.guild.id,
                name,
                reply,
                content,
                embed ? JSON.stringify(embed) : undefined
            )
        ) {
            interaction.reply({
                content: `Tag was created successfully,\nTo try the tag use t.${name}`,
            });
            return;
        } else {
            interaction.reply({
                content: `There was an error while creating the tag,\nIf this had happened more than once, Please contact the developers at ${config.links.server}`,
                ephemeral: true
            });
            await ReportBug(
                `Couldn't create a tag in guildId: **${
                    interaction.guild.id
                }**,\ncontent: ${
                    content ? content : "Nothing (not null)"
                }\nembed: ${embed ? JSON.stringify(embed) : "No Embeds..."}`,
                interaction.user,
                interaction.guild
            );
            return;
        }
    },
};

export default TagCreate;
