import type { Canvas as TypeCanvas } from "canvas";
import Canvas from "canvas";
import { Guild, GuildMember, MessageAttachment, TextChannel } from "discord.js";
import { welcomeSystemSettings } from "../interfaces/GlobalType";
import { clean } from "./Custom";

export async function welcomeMsg(
    member: GuildMember,
    guild: Guild,
    guildSet: welcomeSystemSettings
) {
    let DM_WelcomeMsg = guildSet.dmMessage;
    let CH_WelcomeMsg = guildSet.welcomeChannelMessage;
    if (guildSet.welcomeDM) {
        DM_WelcomeMsg = DM_WelcomeMsg.replace(
            /{member}/g,
            "<@!" + member.user.id + ">"
        )
            .replace(/{server}/g, "**" + clean(guild.name) + "**")
            .replace(/\\new/gi, "\n");
        await member.user.send({ content: DM_WelcomeMsg }).catch(console.error);
    }

    if (guildSet.welcomeChannelID == null) return;
    if (CH_WelcomeMsg) {
        CH_WelcomeMsg = CH_WelcomeMsg.replace(
            /{member}/g,
            "<@!" + member.user.id + ">"
        )
            .replace(/{server}/g, "**" + clean(guild.name) + "**")
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
    if (guildSet.CustomWelcomeBackground) {
        background = await Canvas.loadImage(guildSet.CustomWelcomeBackground);
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
        guildSet.welcomeChannelID
    )) as TextChannel;
    try {
        return channel?.send({ content: CH_WelcomeMsg, files: [attachment] });
    } catch (err) {
        return console.error(err);
    }
}
