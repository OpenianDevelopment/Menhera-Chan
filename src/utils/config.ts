import { config } from "dotenv";
config();
interface _env {
    [key: string]: string | undefined;
    TOKEN: string;
    MONGO_URI: string;
    REPORT_WH: string;
    DBL_TOKEN?: string;
}
const env = process.env as _env;
export default {
    links: {
        donate: "https://ko-fi.com/rohank05",
        website: "https://menhera-chan.in",
        github: "https://github.com/OpenianDevelopment",
        server: "https://discord.gg/a4zkCjg",
    },
    root: ["687893451534106669", "180485886184521728", "534783899331461123"],
    env,
    emojis: {
        KomiBaka: "<:KomiBaka:743366396590948444>",
        MenheraWave: "<:MenheraWave:738775873217495160>",
        MenheraSorry: "<:sorry:762202529756872704>",
        statistics: "📊",
        cake: "🍰",
        glasses: "👓",
        eyes: "👀",
        redCrossMark: "❌",
        whiteHeavyCheckMark: "✅",
        arrowLeft: "⬅️",
        arrowRight: "➡️",
    },
};
