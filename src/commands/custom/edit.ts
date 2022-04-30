import BaseCommand from "../../structures/BaseCommand";
import DiscordClient from "../../client/client";
import {
    CommandInteraction,
    MessageEmbed,
    MessageEmbed as MessageEmbedClass,
    WebhookClient,
} from "discord.js";
import type { MessageEmbedOptions } from "discord.js";
import { editGuildTag } from "../../database/functions/TagsFunctions";
import { CheckPerms } from "../../utils/functions/mod";
import config from "../../utils/config";

export default class CCTEditCommand extends BaseCommand {
    constructor() {
        super("tag edit", "Edits a tag");
    }
    async run(
        client: DiscordClient,
        interaction: CommandInteraction<"cached">
    ) {
        if (
            !(await CheckPerms(
                interaction,
                interaction.user.id,
                "ADMINISTRATOR"
            ))
        ) {
            return;
        }
        const name = interaction.options.getString("name", true);
        const content = interaction.options.getString("content", false);
        const embed: MessageEmbedOptions | undefined =
            interaction.options.getString("embed", false)
                ? JSON.parse(interaction.options.getString("embed", false)!)
                : null;
        const result = await editGuildTag(
            interaction.guildId,
            name,
            content ? content : undefined,
            embed ? JSON.stringify(embed) : undefined
        );
        if (result) {
            interaction.followUp({
                content: `Tag was updated successfully,\nTo try the tag use \`t.${name}\``,
            });
        } else {
            interaction.followUp({
                content: `There was an error while updating the tag,\nIf this had happened more than once, Please contact the developers at ${config.links.server}`,
            });
            const errEmbed = new MessageEmbed()
                .setAuthor({ name: interaction.user.tag })
                .setColor(
                    interaction.user.accentColor
                        ? interaction.user.accentColor
                        : "#696969"
                )
                .setDescription(
                    `Couldn't edit a tag in guildId: **${
                        interaction.guild.id
                    }**,\ncontent: ${
                        content ? content : "Nothing (not null)"
                    }\nembed: ${embed ? JSON.stringify(embed) : "No Embeds..."}`
                )
                .setFooter({ text: `userId: ${interaction.user.id}` });
            const webhook = new WebhookClient({ url: config.env.REPORT_WH });
            await webhook.send({
                content: `${interaction.guild?.name} | ${interaction.guild?.id}`,
                embeds: [errEmbed],
            });
            return;
        }
    }
}
