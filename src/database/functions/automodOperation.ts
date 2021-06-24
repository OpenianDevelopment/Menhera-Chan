import { Antispam } from "../../utils/interfaces/automodInterfaces";
import { antispam } from "../schema";

export async function getAntispamData(guild: string) {
	const result: Antispam = await antispam.findOne({ guild });
	return result;
}
