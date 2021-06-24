export interface Antispam {
	guild: string;
	channels: Array<string>;
	difference: number;
	count: number;
	mute: boolean;
	warn: boolean;
	deleteMsg: boolean;
}
