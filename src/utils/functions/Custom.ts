import {
    MessageEmbed,
    Collection,
    GuildMember,
    User,
    CommandInteraction,
    Message,
    WebhookClient,
    Guild,
} from "discord.js";
import fetch from "cross-fetch";
import DiscordClient from "../../client/client";
import config from "../config";
const webhook = new WebhookClient({ url: process.env.REPORT_WH! });
declare global {
    type RpTypes =
        | "bully"
        | "bite"
        | "cry"
        | "cuddle"
        | "greet"
        | "highfive"
        | "kill"
        | "kiss"
        | "pat"
        | "tickle"
        | "tsundere"
        | "yeet"
        | "smile"
        | "punch"
        | "lick";
}

export function capFirstLetter(value: string) {
    return value.charAt(0).toUpperCase() + value.slice(1);
}

export const _ads = {
    OnCooldown: false,
    embed: function (data: CommandInteraction | Message) {
        return new CustomEmbed(data).setDescription(
            `You can also **[vote for us on top.gg](https://top.gg/bot/${
                data.guild!.client.user!.id
            }/vote)** to support the bot's growth!`
        );
    },
};

export function clean(
    str: string | Array<string> | undefined,
    join?: { start: string; end: string },
    newline?: boolean
): string {
    if (!str) return "";

    return (
        Array.isArray(str)
            ? str
                  .map((str) => (join ? `${join.start}${str}${join.end}` : str))
                  .join(newline ? "\n" : ", ")
            : join
            ? `${join.start}${str}${join.end}`
            : str
    )
        .replace(/`/g, `\\\`${String.fromCharCode(8203)}`)
        .replace(/@/g, `\\\@${String.fromCharCode(8203)}`);
}

/** Returns rp text data */
export function rpTextCollection(authorId: string, memberId: string) {
    return new Collection<RpTypes, string[]>()
        .set("bite", [`<@!${authorId}> *bites* <@!${memberId}>`])
        .set("bully", [`<@!${authorId}> *bullies* <@!${memberId}>!!`])
        .set("cry", [
            `<@!${authorId}> *cries* to <@!${memberId}>`,
            `<@!${authorId}> is crying`,
        ])
        .set("cuddle", [`<@!${authorId}> cuddles <@!${memberId}>, adorable!`])
        .set("greet", [
            `<@!${authorId}> *greets* <@!${memberId}>`,
            `<@!${authorId}> says hello to <@!${memberId}>`,
            `<@!${authorId}> welcomes <@!${memberId}>`,
        ])
        .set("highfive", [
            `<@!${authorId}> gave <@!${memberId}> a high-five`,
            `<@!${authorId}>: *high five*`,
        ])
        .set("kill", [
            `<@!${authorId}> killed <@!${memberId}>`,
            `<@!${memberId}> was killed by <@!${authorId}> `,
        ])
        .set("kiss", [
            `<@!${authorId}> *kisses* <@!${memberId}>`,
            `<@!${authorId}> kissed <@!${memberId}> OwO!`,
        ])
        .set("lick", [
            `Woah <@!${authorId}> licked <@!${memberId}>`,
            `<@!${authorId}> *licks* <@!${memberId}>`,
            `<@!${memberId}> is being licked by <@!${authorId}>`,
        ])
        .set("pat", [`<@!${authorId}> pats <@!${memberId}>`])
        .set("punch", [
            `<@!${authorId}> *punches* <@!${memberId}>`,
            `<@!${authorId}> punches <@!${memberId}>`,
            `<@!${authorId}> *punched* <@!${memberId}>`,
        ])
        .set("smile", [`<@!${authorId}> *smiles* to <@!${memberId}> :D`])
        .set("tickle", [
            `<@!${authorId}> *tickles* <@!${memberId}>`,
            `<@!${authorId}> *tickles* <@!${memberId}> tehehe`,
            `<@!${authorId}> *tickles* <@!${memberId}> hehe!`,
        ])
        .set("tsundere", [
            `Hmph, I didn't want to come with you, I just had nothing better to do!`,
            `You bought me something...  *smiles* Hmph just leave it over there`,
            `Hmph, you didn't have to help, I could've done it by myself`,
            `God, You are so stupid`,
            `You better be grateful!!`,
            `*Gives a meal* I just happened to make some extra`,
            `it's not like i like doing this with you, I only have you around for entertainment purposes only`,
            `Fine be that way, I didn't want you here anyway`,
            `i-its not like I like you or anything! B-baka!`,
        ])
        .set("yeet", [`<@!${authorId}> yeets <@!${memberId}>`]);
}

export function getSub(
    client: DiscordClient,
    commandName: string,
    subcmd: string | null,
    cmdgroup: string | null
): string {
    if (!subcmd) return commandName;
    if (cmdgroup)
        return client.commands.get(`${commandName} ${cmdgroup} ${subcmd}`)!
            .name;
    const command = client.commands.get(`${commandName} ${subcmd}`);
    if (!command) {
        return commandName;
    } else {
        return command.name;
    }
}

/* From https://github.com/zuritor/jikanjs/blob/6a11bcf1d07dfc046e56ddf3ed94adc5db6ac822/lib/util/Request.js */
export class MalRequest {
    /**
     * sends a request with the given list of URL parts and the optional list of query parameter
     * @param {*[]} args           URL Parts
     * @param {{}} [parameter]     Query Parameter
     * @returns {Promise<*>} returns the request response or an error
     */
    async send(args: any, parameter?: any): Promise<any> {
        const response = await fetch(this.urlBuilder(args, parameter));
        const data = await response.json();

        if (response.status !== 200) return null;
        return Promise.resolve(data);
    }

    /**
     *
     * @param {*[]} args            URL Parts
     * @param {{}} [parameter]      Query Parameter
     * @returns {string}            URL
     */
    urlBuilder(args: string[], parameter: any): string {
        const url = new URL("https://api.jikan.moe/v3");

        url.pathname += "/" + args.filter((x: any) => x).join("/");
        if (parameter)
            Object.entries(parameter).forEach(([key, value]) =>
                url.searchParams.append(key, `${value}`)
            );

        return url.href;
    }
}

/**
 * @Noro Use it with commands, use normal { MessageEmbed } with most of the events
 *
 *
 * @param {CommandInteraction | Message} d the interaction or the message object
 * @param {boolean | undefined} ad whether to set the author (with the donate link) or not
 * @returns {MessageEmbed} a normal MessageEmbed
 *
 * *p.s.* Setting a new color/footer data will overwrite the old ones
 */
export class CustomEmbed extends MessageEmbed {
    public constructor(
        d: CommandInteraction | Message,
        ad?: boolean,
        footer?: boolean
    ) {
        super();
        if (ad) {
            this.author = {
                name: "Donate",
                iconURL: d.client.user?.displayAvatarURL(),
                url: config.links.donate,
            };
        }
        this.color = d.guild ? d.guild.me!.displayColor : null;
        if (footer) {
            this.footer = {
                text: config.links.website,
                iconURL: (d.member as GuildMember | null)?.displayAvatarURL(),
            };
        }
    }
}

export async function ReportBug(desc: string, user: User, guild?: Guild) {
    const embed = new MessageEmbed()
        .setTitle("New Report")
        .setColor(user.accentColor ? user.accentColor : "#696969")
        .setFields({
            name: "Author",
            value: `${user.tag} | ${user.id}`,
        })
        .setDescription(desc)
        .setTimestamp();
    return await webhook.send({
        content: guild ? `${guild.name} | ${guild.id}` : `Auto Error Detection`,
        embeds: [embed],
    });
}
