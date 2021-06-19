import { guildConfig } from "../../utils/interfaces/generalInterfaces";
import { guildSettings } from "../schema";

export const getGuildSettings = async (guild: string) => {
	const result: guildConfig = await guildSettings.findOne({
		guild,
	});
	return result;
};
