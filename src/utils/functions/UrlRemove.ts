import DiscordClient from "../../client/client";
import { Message } from "discord.js";

export async function UrlRemove(client: DiscordClient, message: Message) {
    if (!message.guildId) return false;
    let guildSettings = client.guildSettings.get(
        message.guildId
    )?.moderationSettings;
    if (!guildSettings?.urlBlock) return false;
    let content = message.content.toLocaleLowerCase();
    if (!(content.includes("https://") || content.includes("http://")))
        return false;
    if (!guildSettings.urlWhiteList.find((e) => content.includes(e))) {
        let sent = await message.channel.send(
            `${message.author} This link is not allowed`
        );
        message.delete();
        setTimeout(function () {
            sent.delete();
        }, 3000);
        return true;
    }
}
