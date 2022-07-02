import DiscordClient from "../client/client";
import {
    CommandInteraction,
    CommandOptionNonChoiceResolvableType,
    Message,
} from "discord.js";

type Obj = {
    name: string;
    description: string;
    type: CommandOptionNonChoiceResolvableType;
    required: boolean;
};
export default interface CommandInt {
    name: string;
    description: string;
    args?: Obj[];
    aliases?: string[];
    requireArgs?: boolean;
    usage?: string;
    example?: string[];
    run(
        client: DiscordClient,
        data: Message | CommandInteraction,
        args?: string[],
        cmdName?: string
    ): Promise<Message | void> | (Message | void);
}
