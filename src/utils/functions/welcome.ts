import type { Canvas as TypeCanvas } from "canvas";
import Canvas from "canvas";
import {
    Guild,
    GuildMember,
    MessageAttachment,
    MessageEmbed,
    TextChannel,
} from "discord.js";
import { welcomeSystemSettings } from "../interfaces/GlobalType";
import { clean } from "./Custom";

export async function welcomeMsg(
    member: GuildMember,
    guild: Guild,
    welcomeSettings: welcomeSystemSettings
) {
    let DM_WelcomeMsg = welcomeSettings.dmMessage;
    let CH_WelcomeMsg = welcomeSettings.channelMessage;
    if (welcomeSettings.welcomeDM && DM_WelcomeMsg) {
        DM_WelcomeMsg = DM_WelcomeMsg.replace(
            /{member}/g,
            `<@!${member.user.id}>`
        )
            .replace(/{server}/g, `**${clean(guild.name)}**`)
            .replace(/\\new/gi, "\n");
        await member.user.send({ content: DM_WelcomeMsg }).catch(console.error);
    }

    if (welcomeSettings.welcomeChannelID == null) return;
    if (welcomeSettings.enable && CH_WelcomeMsg) {
        CH_WelcomeMsg = CH_WelcomeMsg.replace(
            /{member}/g,
            `<@!${member.user.id}>`
        )
            .replace(/{server}/g, `**${clean(guild.name)}**`)
            .replace(/\\new/gi, "\n");
    }

    const applyText = (canvas: TypeCanvas, text: string) => {
        const ctx = canvas.getContext("2d");

        // Declare a base size of the font
        let fontSize = 40;

        do {
            // Assign the font to the context and decrement it so it can be measured again
            ctx.font = `bold ${(fontSize -= 10)}px sans-serif`;
            // Compare pixel width of the text to the canvas minus the approximate avatar size
        } while (ctx.measureText(text).width > 217);

        // Return the result to use in the actual canvas
        return ctx.font;
    };

    const canvas = Canvas.createCanvas(845, 475);
    const ctx = canvas.getContext("2d");
    let background;
    if (welcomeSettings.CustomWelcomeBackground) {
        background = await Canvas.loadImage(
            welcomeSettings.CustomWelcomeBackground
        );
    } else {
        background = await Canvas.loadImage("./././images/welcome.png");
    }
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#74037b";
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
    // Select the font size and type from one of the natively available fonts
    ctx.font = applyText(canvas, member.displayName);
    // Select the style that will be used to fill the text in
    ctx.fillStyle = "#efefef";
    // Actually fill the text with a solid color
    ctx.fillText(member.displayName, canvas.width / 3.4, canvas.height / 1.7);
    // Pick up the pen
    ctx.beginPath();
    // Start the arc to form a circle
    ctx.arc(175, 225, 75, 0, Math.PI * 2, true);
    // Put the pen down
    ctx.closePath();
    // Clip off the region you drew on
    ctx.clip();
    const avatar = await Canvas.loadImage(
        member.user.displayAvatarURL({ format: "png" })
    );
    // Draw a shape onto the main canvas
    ctx.drawImage(avatar, 100, 150, 150, 150);
    const attachment = new MessageAttachment(
        canvas.toBuffer(),
        "welcome-image.png"
    );

    const channel = (await member.guild.channels.fetch(
        welcomeSettings.welcomeChannelID
    )) as TextChannel;
    try {
        return channel?.send({ content: CH_WelcomeMsg, files: [attachment] });
    } catch (err) {
        return console.error(err);
    }
}

export function welcomeRoles(
    clientId: string,
    member: GuildMember,
    welcomeSettings: welcomeSystemSettings
) {
    const welcomeRoles = welcomeSettings.welcomeRoles;
    if (!welcomeRoles) return;
    welcomeRoles.forEach(async (r) => {
        member.roles.add(r).catch(async (e) => {
            if (welcomeSettings.welcomeChannelID === null) return;
            const channel = (await member.guild.channels.fetch(
                welcomeSettings.welcomeChannelID
            )) as TextChannel;
            if (!channel?.permissionsFor(clientId)?.has(`SEND_MESSAGES`))
                return;
            const embed = new MessageEmbed()
                .setDescription(
                    `Oh no! Something went wrong while assigning role <@&${r}>. /
                        Make sure i have MANAGE ROLES permission and My role is higher. Thanks in advance honey`
                )
                .setColor("RED");
            channel.send({ embeds: [embed] }).catch(() => {});
        });
    });
}
