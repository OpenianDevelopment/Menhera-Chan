import CommandInt from "../../structures/BaseCommand";
import DiscordClient from "../../client/client";
import {
    CommandInteraction,
    Message,
    MessageActionRow,
    MessageButton,
    MessageEmbed,
} from "discord.js";
import { CustomEmbed } from "../../utils/functions/Custom";

const choices = ["Rock", "Paper", "Scissors"];
const RPS: CommandInt = {
    name: "rps",
    description: "Play a game of rock paper scissors",
    async run(client: DiscordClient, interaction: CommandInteraction) {
        //play one's choice
        const p1 = interaction.options.getString("choice", true).toLowerCase();
        // 2nd user
        const user2 = interaction.options.getUser("user", false);
        if (!user2 || user2.bot || user2.id === interaction.user.id) {
            const botChoice =
                choices[Math.floor(Math.random() * choices.length)]; //bot's choice
            const winner: number = getWinner(p1, botChoice);
            let winnerText;
            if (!winner)
                winnerText = `But we both chose ${choiceToEmoji(botChoice)}...`;
            if (winner == 1)
                winnerText = `And congratulations! You won by choosing ${choiceToEmoji(
                    p1
                )} since I chose ${choiceToEmoji(botChoice)}`;
            if (winner == 2)
                winnerText = `And hehe, I won by choosing ${choiceToEmoji(
                    botChoice
                )} since you chose ${choiceToEmoji(p1)}`;
            const embed = new MessageEmbed().setDescription(
                `Since you were so lonely I played with you\n\n${winnerText}`
            );
            interaction.followUp({
                content:
                    winner == 0
                        ? "**Draw**, No one won"
                        : winner == 1
                        ? `**${interaction.user.tag} won!**`
                        : `**${client.user?.tag} won!** *teehee*`,
                embeds: [embed],
            });
            return;
        }
        // to differentiate ids
        const unique = `-${Date.now()}-${interaction.user.id}`;
        const component = new MessageActionRow().addComponents([
            new MessageButton().setCustomId("rock" + unique).setEmoji("🪨"),
            new MessageButton().setCustomId("paper" + unique).setEmoji("📃"),
            new MessageButton().setCustomId("scissors" + unique).setEmoji("✂️"),
        ]);
        const embed = new CustomEmbed(interaction, false, true).setDescription(
            `You have **30 seconds** to choose one of the followings:`
        );
        //p2's choice
        let p2;
        //sending the message
        const msg = (await interaction.followUp({
            content: `<@${user2.id}>`,
            embeds: [embed],
            components: [component],
        })) as Message;
        //collector stuff
        const filter = (int: any) =>
            int.customId.includes(unique) && int.user.id == user2.id;
        const collector = msg.createMessageComponentCollector({
            filter,
            time: 30 * 1000,
        });
        collector.once("collect", (int) => {
            p2 = int.customId.toLowerCase().split("-")[0];
            //getting winner
            const winner: number = getWinner(p1, p2);
            let winnerText;
            if (!winner) winnerText = `So it's a **draw**`;
            if (winner == 1) winnerText = `So **${interaction.user.tag} won!**`;
            if (winner == 2) winnerText = `So **${user2.tag} won!**`;

            embed.setDescription(
                `**${user2.tag}** chose ${choiceToEmoji(p1)}\n**${
                    interaction.user.tag
                }** chose ${choiceToEmoji(p2)}\n\n${winnerText}`
            );

            msg.edit({
                content: "",
                embeds: [embed],
                components: [
                    new MessageActionRow().addComponents([
                        new MessageButton().setEmoji("🪨").setDisabled(true),
                        new MessageButton().setEmoji("📃").setDisabled(true),
                        new MessageButton().setEmoji("✂️").setDisabled(true),
                    ]),
                ],
            });
            return;
        });
        return;
    },
};

function getWinner(authorChoice: string, memberChoice: string) {
    authorChoice = authorChoice.toLowerCase();
    memberChoice = memberChoice.toLowerCase();
    let user1, user2;
    if (authorChoice == "rock") {
        user1 = 1;
    }
    if (authorChoice == "paper") {
        user1 = 2;
    }
    if (authorChoice == "scissors") {
        user1 = 3;
    }
    if (memberChoice == "rock") {
        user2 = 1;
    }
    if (memberChoice == "paper") {
        user2 = 2;
    }
    if (memberChoice == "scissors") {
        user2 = 3;
    }
    let winCon = (user1 || 0) - (user2 || 0);
    // player 1 wins ( author )
    if (winCon == -2 || winCon == 1) {
        return 1;
    }
    //player 2 wins ( member )
    if (winCon == 2 || winCon == -1) {
        return 2;
    }
    // no one wins ( the bot wins :D )
    return 0;
    //getting the winner
}

function choiceToEmoji(str: string) {
    switch (str.toLowerCase()) {
        case "rock":
            return "🪨";
        case "paper":
            return "📃";
        case "scissors":
            return "✂️";
        default:
            return;
    }
}
export default RPS;
