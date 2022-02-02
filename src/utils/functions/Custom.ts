import { MessageEmbed, Guild, Collection, GuildMember, User } from "discord.js";
import fetch from "cross-fetch";
import DiscordClient from "../../client/client";

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
function capFirstLetter(value: string) {
    return value.charAt(0).toUpperCase() + value.slice(1);
}

const _ads = {
    OnCooldown: true,
    embed: function (guild: Guild) {
        return new MessageEmbed()
            .setAuthor({
                name:"Donate",
                iconURL:guild.client.user?.displayAvatarURL(),
                url:"https://ko-fi.com/rohank05"
            })
            .setDescription(
                `You can also **[vote for us on top.gg](https://top.gg/bot/${
                    guild.client.user!.id
                }/vote)** to support us!`
            )
            .setColor(guild.me!.displayColor)
            .setFooter({text:guild.client.user!.tag});
    },
};

function clean(str: string) {
    return (str = str.replace(/`/g, `\\\`${String.fromCharCode(8203)}`));
}

/** Returns rp text data */
function rpTextCollection(author: User, member: GuildMember) {
    const _crp = new Collection<RpTypes, string[]>()
        .set("bite", [
            `<@!${author.id}> *bites* <@!${member.user.id}>`,
            `Ouch looks like it hurts`,
        ])
        .set("bully", [
            `Oh look the big bully <@!${author.id}> has arrived`,
            `<@!${member.user.id}> is crying from getting bullied`,
            `<@!${author.id}> *bullies* <@!${member.user.id}>!! Hehe!`,
        ])
        .set("cry", [
            `<@!${author.id}> *cries* to <@!${member.user.id}>`,
            `<@!${author.id}> wants <@!${member.user.id}> to give 'em a hug`,
            `<@!${author.id}> is crying :c`,
        ])
        .set("cuddle", [
            `OwO <@!${author.id}> and <@!${member.user.id}> looks cute together`,
            `<@!${author.id}> cuddles <@!${member.user.id}>, adorable!`,
        ])
        .set("greet", [
            `<@!${author.id}> *greets* <@!${member.user.id}>`,
            `hi there it seems like we got a new <@!${member.user.id}>`,
            `<@!${author.id}> says hi to <@!${member.user.id}>`,
            `hi there <@!${member.user.id}>`,
            `<@!${author.id}> welcomes <@!${member.user.id}>`,
        ])
        .set("highfive", [
            `<@!${author.id}> gave <@!${member.user.id}> five`,
            `<@!${author.id}>: *high five*`,
        ])
        .set("kill", [
            `<@!${author.id}> killed <@!${member.user.id}>`,
            `<@!${member.user.id}> was killed by <@!${author.id}> `,
        ])
        .set("kiss", [
            `Your lovey dovey <@!${author.id}> *kissed* <@!${member.user.id}>`,
            `<@!${author.id}> kissed <@!${member.user.id}> OwO!`,
        ])
        .set("lick", [
            `Woah <@!${author.id}> licked <@!${member.user.id}>`,
            `<@!${author.id}> *licks* <@!${member.user.id}> lick lick lick`,
            `<@!${member.user.id}> is being licked by <@!${author.id}>`,
        ])
        .set("pat", [
            `<@!${author.id}> pats <@!${member.user.id}>`,
            `<@!${member.user.id}> died from extreme cuteness of <@!${author.id}>, rip`,
        ])
        .set("punch", [
            `<@!${author.id}> *punches* <@!${member.user.id}>!`,
            `<@!${member.user.id}> cries cuz <@!${author.id}> punched 'em`,
            `<@!${author.id}> punches <@!${member.user.id}>, OOF!`,
            `<@!${author.id}> *punched* <@!${member.user.id}>! :c`,
        ])
        .set("smile", [
            `<@!${author.id}> is happy! yay!`,
            `<@!${author.id}> seems so happy c:`,
            `<@!${author.id}> *smiles* to <@!${member.user.id}> :D`,
            `hey, <@!${member.user.id}> what did you say to make <@!${author.id}> smile?`,
        ])
        .set("tickle", [
            `<@!${author.id}> *tickles* <@!${member.user.id}>`,
            `<@!${author.id}> *tickles* <@!${member.user.id}> tehehe`,
            `<@!${author.id}> *tickles* <@!${member.user.id}>!! Hehe!`,
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
        .set("yeet", [
            `OOF <@!${member.user.id}> flied away`,
            `Ouch looks like it hurts!`,
            `now <@!${author.id}> regrets yeeting <@!${member.user.id}> \\😢`,
        ]);
    return _crp;
}

function getSub(
    client: DiscordClient,
    command: string,
    subcmd: string | null
): string {
    if (!subcmd) return command;
    return client.commands.get(`${command} ${subcmd}`)!.name;
}

/* From https://github.com/zuritor/jikanjs/blob/6a11bcf1d07dfc046e56ddf3ed94adc5db6ac822/lib/util/Request.js */
class MalRequest {
    /**
     * sends a request with the given list of URL parts and the optional list of query parameter
     * @param {*[]} args           URL Parts
     * @param {{}} [parameter]     Query Parameter
     * @returns {Promise<*>} returns the request response or an error
     */
    async send(args: any, parameter?: any): Promise<any> {
        var response = await fetch(this.urlBuilder(args, parameter));
        var data = await response.json();

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
        var url = new URL("https://api.jikan.moe/v3");

        url.pathname += "/" + args.filter((x: any) => x).join("/");
        if (parameter)
            Object.entries(parameter).forEach(([key, value]) =>
                url.searchParams.append(key, `${value}`)
            );

        return url.href;
    }
}

export { capFirstLetter, _ads, rpTextCollection, clean, getSub, MalRequest };
