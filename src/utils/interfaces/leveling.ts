export interface userXP {
    user: string;
    id: string;
    xp: number;
    level: number;
    background: string;
    opacity: number;
    trackColor: string;
    textColor: string;
}

export interface guildXP {
    guild: string;
    users: Array<userXP>;
}

export interface rankcardData {
    width: number;
    height: number;
    backgroundImage: string;
    color: {
        main: string;
        track: string;
    };
    opacity: number;
    username: string;
    discriminator: string;
    avatarURL: string;
    font: {
        bold: string;
        normal: string;
    };
    level: number;
    rank: number;
    xp: number;
    MinXP: number;
    MaxXP: number;
}
