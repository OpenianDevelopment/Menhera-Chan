import { Message, MessageEmbed } from "discord.js";
import DiscordClient from "../../client/client";
import { BaseCommand } from "../../utils/structures";
import axios from "axios";

export default class MenheraCommand extends BaseCommand {
    constructor() {
        super(
            "menhera",
            "Get Menhera Images from r/menhera",
            "general",
            [],
            "menhera",
            "menhera"
        );
    }
    async run(client: DiscordClient, message: Message, args: Array<string>) {
        await axios
            .get("https://www.reddit.com/r/menhera/.json")
            .then((body) => {
                const post = body.data.children.filter(
                    (b: any) => b.data.link_flair_text === "Menhera-chan"
                );
                const random = Math.floor(Math.random() * post.length + 1);
                const menhera = post[random - 1];
                const embed = new MessageEmbed()
                    .setTitle(menhera.data.title)
                    .setColor("#FFC0CB")
                    .setURL(`https://www.reddit.com${menhera.data.permalink}`)
                    .setDescription(`Post by: u/${menhera.data.author}`)
                    .setImage(menhera.data.url);

                message.reply({ embeds: [embed] });
            });
    }
}
